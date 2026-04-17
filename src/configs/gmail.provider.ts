import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_USER,
} from './env.js';

if (
  !GMAIL_USER ||
  !GMAIL_CLIENT_ID ||
  !GMAIL_CLIENT_SECRET ||
  !GMAIL_REFRESH_TOKEN
) {
  throw new Error('Missing Gmail OAuth environment variables');
}

// --------------------
// OAUTH CLIENT
// --------------------
const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN,
});

// --------------------
// TRANSPORTER FACTORY
// --------------------
export const createGmailTransporter = async () => {
  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: accessToken?.token || '',
    },
  } as any); // avoids TS overload issue
};

// --------------------
// MAIL SERVICE (USE THIS IN APP)
// --------------------
export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = await createGmailTransporter();

  return transporter.sendMail({
    from: `"App" <${GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
