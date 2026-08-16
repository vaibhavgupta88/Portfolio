export function detectCDN(headers: Record<string, string>): string {
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers || {})) {
    normalizedHeaders[key.toLowerCase()] = String(value).toLowerCase();
  }

  const server = normalizedHeaders['server'] || '';
  const via = normalizedHeaders['via'] || '';

  if (normalizedHeaders['cf-ray'] || server.includes('cloudflare')) {
    return 'Cloudflare';
  }
  if (normalizedHeaders['x-amz-cf-id'] || normalizedHeaders['x-amz-cf-pop']) {
    return 'Amazon CloudFront';
  }
  if (normalizedHeaders['x-served-by']?.includes('cache-') || normalizedHeaders['x-fastly-request-id'] || server.includes('fastly')) {
    return 'Fastly';
  }
  if (server.includes('akamai') || normalizedHeaders['x-akamai-transformed']) {
    return 'Akamai';
  }
  if (normalizedHeaders['x-vercel-id'] || server.includes('vercel')) {
    return 'Vercel Edge Network';
  }
  if (normalizedHeaders['x-nf-request-id'] || server.includes('netlify')) {
    return 'Netlify Edge';
  }
  if (normalizedHeaders['x-sucuri-id'] || server.includes('sucuri')) {
    return 'Sucuri Firewall';
  }
  if (normalizedHeaders['x-iinfo'] || server.includes('imperva') || server.includes('incapsula')) {
    return 'Imperva / Incapsula';
  }
  if (normalizedHeaders['x-edge-connect-mid'] || via.includes('azure')) {
    return 'Azure Front Door';
  }
  if (via.includes('google') || server.includes('gws') || server.includes('ghs')) {
    return 'Google Cloud CDN';
  }

  return 'Direct Origin / Uncached';
}
