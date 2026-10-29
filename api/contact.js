module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { name, email, reason, message } = req.body || {};

  if (
    !name ||
    typeof name !== 'string' ||
    !email ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ||
    !reason ||
    typeof reason !== 'string' ||
    !message ||
    typeof message !== 'string'
  ) {
    return res.status(400).json({
      ok: false,
      error: 'Please provide valid name, email, reason for contact, and message.'
    });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL || process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(503).json({
      ok: false,
      configured: false,
      fallback: 'mailto',
      message: 'External webhook credentials are not configured; use prefilled email handoff.'
    });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        reason: reason.trim(),
        message: message.trim(),
        submittedAt: new Date().toISOString()
      })
    });

    if (!upstream.ok) {
      return res.status(502).json({
        ok: false,
        fallback: 'mailto',
        error: 'Upstream webhook returned HTTP ' + upstream.status
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      fallback: 'mailto',
      error: 'Failed to reach upstream webhook.'
    });
  }
};
