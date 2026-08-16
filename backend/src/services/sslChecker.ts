import tls from 'tls';
import { URL } from 'url';

export interface SSLInfo {
  valid: boolean;
  daysRemaining?: number;
  validFrom?: string;
  validTo?: string;
  issuer?: string;
  subject?: string;
  error?: string;
}

export function checkSSLCertificate(targetUrl: string, timeoutMs: number = 5000): Promise<SSLInfo> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol !== 'https:') {
        return resolve({ valid: false, error: 'Not an HTTPS endpoint' });
      }

      const host = parsed.hostname;
      const port = parsed.port ? parseInt(parsed.port, 10) : 443;

      const socket = tls.connect(
        {
          host,
          port,
          servername: host,
          rejectUnauthorized: false, // allow fetching cert even if self-signed/expired for detailed diagnostics
        },
        () => {
          const cert = socket.getPeerCertificate(true);
          socket.destroy();

          if (!cert || !cert.valid_to) {
            return resolve({ valid: false, error: 'No certificate details returned' });
          }

          const validTo = new Date(cert.valid_to);
          const validFrom = new Date(cert.valid_from);
          const now = new Date();

          const timeDiff = validTo.getTime() - now.getTime();
          const daysRemaining = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));

          const parseCertString = (val: any): string => {
            if (!val) return '';
            if (Array.isArray(val)) return val.join(', ');
            return String(val);
          };

          const issuer = typeof cert.issuer === 'object' && cert.issuer
            ? parseCertString(cert.issuer.O || cert.issuer.CN)
            : parseCertString(cert.issuer);

          const subject = typeof cert.subject === 'object' && cert.subject
            ? parseCertString(cert.subject.CN)
            : parseCertString(cert.subject);

          resolve({
            valid: daysRemaining > 0,
            daysRemaining,
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            issuer,
            subject,
          });
        }
      );

      socket.setTimeout(timeoutMs, () => {
        socket.destroy();
        resolve({ valid: false, error: 'SSL inspection connection timed out' });
      });

      socket.on('error', (err) => {
        socket.destroy();
        resolve({ valid: false, error: err.message || 'TLS socket error' });
      });
    } catch (err: any) {
      resolve({ valid: false, error: err.message || 'Invalid URL' });
    }
  });
}
