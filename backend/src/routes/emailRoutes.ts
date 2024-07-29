// not used in the application yet 

import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Mail configuration
const receiverEmail =  process.env.GMAIL_USER

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or any other mail service
  auth: {
    user: "email-address", // process.env.GMAIL_USER,  //  email address
    pass: "password"// process.env.GMAIL_PASSWORD     // email password or application-specific password
  }
});

// POST route to send an email
router.post('/send', async (req: Request, res: Response) => {
  const { to, subject, message } = req.body;

  // Validate request body
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const info = await transporter.sendMail({
      from: "email-address", // Sender address
      to:  to, // receiverEmail,                          // List of receivers
      subject,                     // Subject line
      text: message                         // Plain text body
    });
    res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    console.error('Error sending email:', (error as Error).message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
