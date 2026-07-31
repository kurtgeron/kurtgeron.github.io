import type {NextApiRequest, NextApiResponse} from 'next';
import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {name, email, message} = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({error: 'Missing fields'});
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'kurtgeron.business@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    return res.status(200).json({success: true});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Failed to send email'});
  }
}
