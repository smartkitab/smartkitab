import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter instance
 */
const createTransporter = () => {
  const rawEmailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const rawEmailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!rawEmailUser || !rawEmailPass) {
    return null;
  }

  const emailUser = rawEmailUser.trim();
  // Strip any accidental spaces from Google 16-character App Passwords
  const emailPass = rawEmailPass.replace(/\s+/g, '').trim();

  // If custom host is explicitly specified
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Default to standard Gmail service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/**
 * Send an account verification email to a buyer or seller
 */
export const sendVerificationEmail = async ({ to, name, verificationToken, role }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
  const senderAddress =
    process.env.EMAIL_FROM ||
    `"SMARTKITAB" <${process.env.EMAIL_USER || 'support@smartkitab.com'}>`;

  const roleLabel = role === 'seller' ? 'Seller & Donor' : 'Student & Reader';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activate Your SMARTKITAB Account</title>
      <style>
        body { margin: 0; padding: 0; background-color: #FAF6EF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #292524; }
        .wrapper { width: 100%; max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid rgba(121, 82, 56, 0.15); }
        .header { background: linear-gradient(135deg, #795238 0%, #543722 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; margin: 0; }
        .logo span { color: #E07A5F; }
        .tagline { font-size: 11px; font-weight: 700; color: #D1FAE5; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 36px 30px; text-align: left; }
        .greeting { font-size: 20px; font-weight: 800; color: #1c1917; margin-bottom: 12px; }
        .paragraph { font-size: 14px; line-height: 1.6; color: #44403c; margin-bottom: 24px; }
        .badge { display: inline-block; background-color: #FAF6EF; border: 1px solid #795238; color: #795238; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; }
        .button-wrapper { text-align: center; margin: 32px 0; }
        .activate-btn { display: inline-block; background-color: #795238; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 800; padding: 14px 34px; border-radius: 14px; box-shadow: 0 4px 12px rgba(121, 82, 56, 0.3); letter-spacing: 0.3px; }
        .link-note { font-size: 12px; color: #78716c; line-height: 1.5; word-break: break-all; background: #FAF6EF; padding: 12px 16px; border-radius: 12px; border: 1px dashed rgba(121, 82, 56, 0.25); }
        .footer { background-color: #FAF6EF; padding: 20px 24px; text-align: center; font-size: 12px; color: #78716c; border-top: 1px solid rgba(121, 82, 56, 0.1); }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1 class="logo">SMART<span>KITAB</span></h1>
          <div class="tagline">पुराना किताब, नयाँ ज्ञान</div>
        </div>
        <div class="content">
          <div class="badge">${roleLabel} Account</div>
          <div class="greeting">Namaste ${name || 'Friend'},</div>
          <p class="paragraph">
            Thank you for signing up on <strong>SMARTKITAB</strong> — Nepal's leading circular bookstore for buying, selling, and reusing second-hand books.
          </p>
          <p class="paragraph">
            To activate your account and verify your email address, please click the confirmation button below:
          </p>
          <div class="button-wrapper">
            <a href="${verificationUrl}" class="activate-btn" target="_blank">Activate My Account</a>
          </div>
          <p class="paragraph" style="font-size: 12px; color: #78716c;">
            This activation link is valid for <strong>24 hours</strong>. If you did not create a SMARTKITAB account, you can safely ignore this email.
          </p>
          <div class="link-note">
            <strong>Button not working?</strong> Copy and paste this URL in your browser:<br>
            <a href="${verificationUrl}" style="color: #795238; text-decoration: underline;">${verificationUrl}</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SMARTKITAB Nepal. All rights reserved.<br>
          Kathmandu, Nepal &bull; Empowering students through affordable education.
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    console.log('\n===============================================================');
    console.log(' [EMAIL SIMULATION] SMTP Credentials not configured in .env');
    console.log(` Recipient: ${to} (${name})`);
    console.log(` Verification Link: ${verificationUrl}`);
    console.log(' To send live emails, configure EMAIL_USER & EMAIL_PASS in backend/.env');
    console.log('===============================================================\n');
    return { success: true, simulated: true, verificationUrl };
  }

  try {
    const info = await transporter.sendMail({
      from: senderAddress,
      to,
      subject: 'Verify & Activate Your SMARTKITAB Account 📚',
      text: `Namaste ${name},\n\nPlease activate your SMARTKITAB account by visiting: ${verificationUrl}\n\nThis link expires in 24 hours.`,
      html: htmlContent,
    });

    console.log(`Verification email successfully sent to ${to}: messageId ${info.messageId}`);
    return { success: true, messageId: info.messageId, verificationUrl };
  } catch (err) {
    console.error(`Failed to send verification email to ${to}:`, err.message);
    return { success: false, error: err.message, verificationUrl };
  }
};
