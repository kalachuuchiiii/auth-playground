import 'server-only';
import { google } from "googleapis";


const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});


const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
});


export async function sendOtpEmail(
    recipient: string,
    otp: string
) {
    const message = [
        `From: ${process.env.GMAIL_SENDER}`,
        `To: ${recipient}`,
        "Subject: Your Firepatch verification code",
        "Content-Type: text/plain; charset=utf-8",
        "",
        `Your verification code is ${otp}.`,
        "It expires in 10 minutes.",
    ].join("\r\n");

    const raw = Buffer.from(message).toString("base64url");

    return await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw },
    });
}