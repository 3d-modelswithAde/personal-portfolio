const crypto = require('crypto');

const DEFAULT_SHEET_ID = '1F81sDd6ly31_VAx76NNsSkOWXEgWrfCqeNO5_7P5RJQ';
const DEFAULT_SHEET_RANGE = 'Enquiries!A:F';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getGoogleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer
    .sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${unsigned}.${signature}`;
  const tokenRes = await fetch(
    serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      }).toString()
    }
  );

  if (!tokenRes.ok) {
    throw new Error(`Google OAuth token error: HTTP ${tokenRes.status}`);
  }
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

async function appendToGoogleSheet(serviceAccount, sheetId, rowValues) {
  const accessToken = await getGoogleAccessToken(serviceAccount);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    sheetId
  )}/values/${encodeURIComponent(
    DEFAULT_SHEET_RANGE
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [rowValues]
    })
  });

  if (!res.ok) {
    throw new Error(`Google Sheets append error: HTTP ${res.status}`);
  }
  return res.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const body = req.body || {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const reason =
    typeof (body.reason || body.objective) === 'string'
      ? (body.reason || body.objective).trim()
      : '';
  const message =
    typeof (body.message || body.process) === 'string'
      ? (body.message || body.process).trim()
      : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';

  if (
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    !reason ||
    !message
  ) {
    return res.status(400).json({
      ok: false,
      error: 'Please provide valid name, email, reason for contact, and message.'
    });
  }

  const timestamp = new Date().toISOString();
  const payload = {
    name,
    email,
    reason,
    message,
    objective: reason,
    process: message,
    company,
    submittedAt: timestamp
  };

  // 1. Try configured n8n webhook URL if set and non-localhost (or if running locally)
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL || process.env.ENQUIRY_WEBHOOK_URL;
  const isVercelCloud = Boolean(process.env.VERCEL);
  const isLocalhostWebhook =
    webhookUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(webhookUrl);

  if (webhookUrl && (!isVercelCloud || !isLocalhostWebhook)) {
    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (upstream.ok) {
        const data = await upstream.json().catch(() => ({}));
        if (data.success !== false) {
          return res.status(200).json({ ok: true, success: true, via: 'n8n-webhook' });
        }
      }
    } catch (err) {
      // Fall through to direct Google Sheets backup if upstream webhook is unreachable
    }
  }

  // 2. Direct server-side Google Sheets append (same sheet as n8n workflow u3bkXjr7CvqxXQk0)
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  if (saJson) {
    try {
      const credentials = JSON.parse(saJson);
      await appendToGoogleSheet(credentials, sheetId, [
        timestamp,
        reason,
        name,
        email,
        company,
        message
      ]);
      return res.status(200).json({ ok: true, success: true, via: 'google-sheets' });
    } catch (err) {
      return res.status(502).json({
        ok: false,
        fallback: 'mailto',
        error: 'Could not record enquiry to storage.'
      });
    }
  }

  return res.status(503).json({
    ok: false,
    configured: false,
    fallback: 'mailto',
    message: 'External webhook credentials are not configured; use prefilled email handoff.'
  });
};
