export const verificationTemplate = (otp: string) => {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
    
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .link {
                display: inline-block;
                width: 205px;
                text-decoration: none;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                padding: 20px;
                background: #ffdbb1;
                text-align: center;
                font-size: x-large;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                font-weight: 900;
                color: rgb(83, 35, 0);
                border-radius: 1rem;
                margin-bottom: 10px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a class="link" href="#">
                <div class="logo">
                    TalkVerse
                </div>
            </a>
            <div class="message">OTP Verification Email</div>
            <div class="body">
                <p>Dear User,</p>
                <p>Thank you for registering with TalkVerse. To complete your registration, please use the following OTP
                    (One-Time Password) to verify your account:</p>
                <h2 class="highlight">${otp}</h2>
                <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
                    Once your account is verified, you will have access to our platform and its features.</p>
            </div>
            <div class="support">
                If you have any questions or need assistance, please feel free to reach out to us at
                <a href="mailto:info@talkverse.com">info@talkverse.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};

export const ForgotPasswordOtpTemplate = (otp: string) => {
  return `<!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }

            .container {

                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }

            .link {
                display: inline-block;
                width: 205px;
                text-decoration: none;
                text-align: center;
            }

            .logo {
                max-width: 200px;
                padding: 20px;
                background: #ffdbb1;
                text-align: center;
                font-size: x-large;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                font-weight: 900;
                color: rgb(83, 35, 0);
                border-radius: 1rem;
                margin-bottom: 10px;
            }

            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }

            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
            }
        </style>

    </head>

    <body>
        <div class="container">
            <a class="link" href="#">
                <div class="logo">
                    TalkVerse
                </div>
            </a>
            <div class="message">OTP Verification Email</div>
            <div class="body">
                <p>Dear User,</p>
                <p>For setting up new password, please use the following OTP
                    (One-Time Password) to verify your account:</p>
                <h2 class="highlight">${otp}</h2>
                <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
                </p>
            </div>
            <div class="support">
                If you have any questions or need assistance, please feel free to reach out to us at
                <a href="mailto:info@talkverse.com">info@talkverse.com</a>. We are here to help!
            </div>
        </div>
    </body>

    </html>`;
};

export const passwordUpdatedTemplate = (userName: string, email: string) => {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
    
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .link {
                display: inline-block;
                width: 205px;
                text-decoration: none;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                padding: 20px;
                background: #ffdbb1;
                text-align: center;
                font-size: x-large;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                font-weight: 900;
                color: rgb(83, 35, 0);
                border-radius: 1rem;
                margin-bottom: 10px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a class="link" href="#">
                <div class="logo">
                    TalkVerse
                </div>
            </a>
            <div class="message">Password Update Confirmation</div>
            <div class="body">
                <p>Hey ${userName},</p>
                <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.
                </p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                at
                <a href="mailto:info@talkverse.com">info@talkverse.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};

export const privateKeyTemplate = (email: string, privateKey: string) => {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
    
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .link {
                display: inline-block;
                width: 205px;
                text-decoration: none;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                padding: 20px;
                background: #ffdbb1;
                text-align: center;
                font-size: x-large;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                font-weight: 900;
                color: rgb(83, 35, 0);
                border-radius: 1rem;
                margin-bottom: 10px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                padding: 1rem;
                background-color: rgb(0, 0, 0);
                font-weight: bold;
                color: white;
                white-space: wrap;
                width: 90%;
                overflow-wrap: break-word;
                margin: 0 auto;
            }
    
            .mainBold {
                font-size: 18px;
                font-weight: bold;
                color: red;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a class="link" href="#">
                <div class="logo">
                    TalkVerse
                </div>
            </a>
            <div class="message">${email}: Secure Access Key</div>
            <div class="body">
                <p class="highlight">
                    ${privateKey}
                </p>
                <p>Thank you for choosing our chat service. To ensure the security of your communication, we have generated
                    a unique access key specifically for you. This key will grant you access to our chat platform.
                </p>
                <p><span class="mainBold">Please keep this key confidential and do not share it with anyone. If you lose
                        this key, you will be unable to access the chat.</span> We recommend storing it in a safe place,
                    such as a password manager or a secure note.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                at
                <a href="mailto:info@talkverse.com">info@talkverse.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};
