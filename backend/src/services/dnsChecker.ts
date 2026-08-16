import dns from 'dns/promises';
import { URL } from 'url';

export interface DNSInfo {
  lookupTimeMs: number;
  addresses: string[];
  resolved: boolean;
  error?: string;
}

export async function checkDNS(targetUrl: string): Promise<DNSInfo> {
  const start = performance.now();
  try {
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname;

    const records = await dns.resolve4(hostname).catch(async () => {
      // Fallback to dns.lookup if resolve4 fails (e.g. localhost or custom hosts)
      const res = await dns.lookup(hostname);
      return [res.address];
    });

    const elapsed = Math.round(performance.now() - start);
    return {
      lookupTimeMs: elapsed,
      addresses: records,
      resolved: true,
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - start);
    return {
      lookupTimeMs: elapsed,
      addresses: [],
      resolved: false,
      error: err.message || 'DNS resolution failed',
    };
  }
}
