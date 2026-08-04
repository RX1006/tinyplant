// /api/subscribe.js
// Vercel Serverless Function — receives the raffle signup email and adds it
// as a contact to a Resend Audience.
//
// Required environment variables (set these in Vercel Project Settings > Environment Variables):
//   RESEND_API_KEY      - your Resend API key (starts with "re_")
//   RESEND_AUDIENCE_ID  - the ID of the Resend Audience you want entrants added to
//
// How to find RESEND_AUDIENCE_ID:
//   Resend dashboard -> Audiences -> create or open an audience -> copy its ID
//   (looks like: 78261eea-8f8b-4381-83c6-79fa7120f1cf)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  // Basic validation
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID environment variable.');
    return res.status(500).json({ error: 'Server is not configured correctly.' });
  }

  try {
    const resendRes = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          unsubscribed: false,
        }),
      }
    );

    const data = await resendRes.json();

    // Resend returns 400 if the contact already exists on some plans —
    // treat that as a success from the user's point of view so re-submitting
    // doesn't feel like an error.
    if (!resendRes.ok) {
      const alreadyExists =
        typeof data?.message === 'string' &&
        data.message.toLowerCase().includes('already exists');

      if (!alreadyExists) {
        console.error('Resend API error:', data);
        return res.status(502).json({ error: 'Could not save your entry. Please try again.' });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Unexpected error calling Resend:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
