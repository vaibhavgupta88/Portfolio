import axios, { AxiosResponse } from 'axios';
import { IWebsite, Website, CheckStatus } from '../models/Website';
import { MonitoringCheck } from '../models/MonitoringCheck';
import { checkSSLCertificate } from './sslChecker';
import { checkDNS } from './dnsChecker';
import { detectCDN } from './cdnDetector';
import { processWebsiteCheckResult } from './incidentService';
import { getIO } from '../socket/socketHandler';

export async function performCheckForWebsite(website: IWebsite, region: string = 'us-east') {
  const startTime = performance.now();
  let status: CheckStatus = 'up';
  let statusCode: number | undefined;
  let responseTimeMs = 0;
  let ttfbMs = 0;
  let dnsLookupTimeMs = 0;
  let sslDaysRemaining: number | undefined;
  let redirectChain: string[] = [website.url];
  let headers: Record<string, string> = {};
  let errorMessage: string | undefined;
  let cdnProvider = 'Direct / Standard';

  // 1. DNS Resolution Check
  const dnsResult = await checkDNS(website.url);
  dnsLookupTimeMs = dnsResult.lookupTimeMs;

  if (!dnsResult.resolved) {
    status = 'down';
    errorMessage = dnsResult.error || 'DNS Lookup Failed';
  } else {
    // 2. HTTP Request Check
    try {
      const httpStart = performance.now();
      let ttfbCaptured = false;

      const response: AxiosResponse = await axios.get(website.url, {
        timeout: website.timeoutMs || 10000,
        maxRedirects: 5,
        validateStatus: () => true, // Don't throw on 4xx/5xx to capture status code accurately
        headers: {
          'User-Agent': 'InternetResilienceMap-Probe/1.0 (+https://resiliencemap.io)',
          'Accept': '*/*',
        },
      });

      const httpEnd = performance.now();
      responseTimeMs = Math.round(httpEnd - startTime);
      ttfbMs = Math.round(httpEnd - httpStart); // TTFB estimation
      statusCode = response.status;

      // Extract response headers
      headers = {};
      for (const [k, v] of Object.entries(response.headers)) {
        if (typeof v === 'string') {
          headers[k] = v;
        } else if (Array.isArray(v)) {
          headers[k] = v.join(', ');
        }
      }

      // Track redirect chain if available in request details
      if ((response.request as any)?._redirectable?._redirects) {
        const redirects = (response.request as any)._redirectable._redirects;
        redirectChain = [website.url, ...redirects.map((r: any) => r.redirectUrl)];
      }

      // CDN Detection
      cdnProvider = detectCDN(headers);

      // Status determination
      if (statusCode !== website.expectedStatusCode && !(website.expectedStatusCode === 200 && statusCode >= 200 && statusCode < 300)) {
        status = 'down';
        errorMessage = `HTTP Status ${statusCode} did not match expected ${website.expectedStatusCode}`;
      } else if (responseTimeMs > website.responseTimeThresholdMs) {
        status = 'degraded';
        errorMessage = `Response time (${responseTimeMs}ms) exceeded threshold (${website.responseTimeThresholdMs}ms)`;
      }
    } catch (err: any) {
      status = 'down';
      responseTimeMs = Math.round(performance.now() - startTime);
      errorMessage = err.message || 'HTTP Connection Failed';
    }
  }

  // 3. SSL Inspection if HTTPS
  if (website.url.startsWith('https://')) {
    const sslResult = await checkSSLCertificate(website.url);
    if (sslResult.daysRemaining !== undefined) {
      sslDaysRemaining = sslResult.daysRemaining;
    }
  }

  // 4. Save Monitoring Check Record
  const checkRecord = await MonitoringCheck.create({
    websiteId: website._id,
    status,
    statusCode,
    responseTimeMs,
    dnsLookupTimeMs,
    ttfbMs,
    sslDaysRemaining,
    redirectChain,
    headers,
    cdnProvider,
    region,
    errorMessage,
    timestamp: new Date(),
  });

  // 5. Calculate overall historical uptime percentage for this website (last 100 checks)
  const recentChecks = await MonitoringCheck.find({ websiteId: website._id })
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

  const upCount = recentChecks.filter((c) => c.status === 'up' || c.status === 'degraded').length;
  const totalCount = recentChecks.length;
  const uptimePercentage = totalCount > 0 ? Number(((upCount / totalCount) * 100).toFixed(2)) : 100;

  // 6. Update Website Document
  website.lastCheckStatus = status;
  website.lastCheckedAt = new Date();
  website.lastResponseTimeMs = responseTimeMs;
  website.uptimePercentage = uptimePercentage;
  if (sslDaysRemaining !== undefined) website.sslDaysRemaining = sslDaysRemaining;
  website.cdnProvider = cdnProvider;
  await website.save();

  // 7. Process Incidents and Notifications
  await processWebsiteCheckResult({
    website,
    status,
    statusCode,
    responseTimeMs,
    errorMessage,
    sslDaysRemaining,
    dnsResolved: dnsResult.resolved,
  });

  // 8. Emit Socket.IO live updates
  const io = getIO();
  if (io) {
    io.emit('monitoring:check_result', {
      websiteId: website._id,
      check: checkRecord,
      websiteSummary: {
        id: website._id,
        name: website.name,
        url: website.url,
        lastCheckStatus: status,
        lastResponseTimeMs: responseTimeMs,
        uptimePercentage,
        sslDaysRemaining,
        cdnProvider,
      },
    });
  }

  return checkRecord;
}

export async function runMonitoringCycleForAllActiveWebsites() {
  try {
    const activeWebsites = await Website.find({ isPaused: false });
    if (activeWebsites.length === 0) return;

    console.log(`[Monitoring Engine] Running health check for ${activeWebsites.length} active website(s)...`);
    
    // Process concurrently with settled Promises
    await Promise.allSettled(
      activeWebsites.map(async (website) => {
        try {
          await performCheckForWebsite(website, 'us-east');
        } catch (err) {
          console.error(`[Monitoring Engine] Error checking ${website.url}:`, err);
        }
      })
    );
  } catch (error) {
    console.error('[Monitoring Engine] Fatal error during monitoring cycle:', error);
  }
}
