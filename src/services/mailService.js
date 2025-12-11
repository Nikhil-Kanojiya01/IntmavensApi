const transporter = require('../config/mailConfig');
const { buildTemplate, TEMPLATE_TYPES } = require('../templates');

const HEADER_IMAGE = 'https://res.cloudinary.com/ddgd5aq1u/image/upload/v1765443568/Add_a_heading_1_via4n9.png';
const FOOTER_IMAGE = 'https://res.cloudinary.com/ddgd5aq1u/image/upload/v1765443577/Add_a_heading_4_g7eoqs.png';


async function sendEmail(templateType, formData) {
  try {
    // Validate template type
    const validTemplates = Object.values(TEMPLATE_TYPES);
    if (!validTemplates.includes(templateType)) {
      throw new Error(`Invalid template type: ${templateType}. Valid types: ${validTemplates.join(', ')}`);
    }

    const { name, email, phone, message, ...rest } = formData;
    
    // Build email content from template
    const { subject, html } = buildTemplate(templateType, {
      name,
      email,
      phone,
      message,
      ...rest,
    });
    
    const results = {};
    
    // Send email to admin (same as sender email)
    try {
      const adminInfo = await transporter.sendMail({
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: process.env.SENDER_EMAIL,
        replyTo: email,
        subject: `[ADMIN] ${subject}`,
        html,
      });
      results.adminEmail = adminInfo;
      console.log(`✅ Admin email sent (${templateType}):`, process.env.SENDER_EMAIL);
    } catch (adminError) {
      console.error(`❌ Failed to send admin email (${templateType}):`, adminError.message);
      results.adminEmail = null;
      results.adminError = adminError.message;
    }
    
    // Send confirmation email to user
    try {
      const userSubject = `We received your message`;
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center;">
            <img src="${HEADER_IMAGE}" alt="Intmavens" style="width: 100%; max-width: 600px; display: block;" />
          </div>
          
          <div style="background: #f9f9f9; padding: 30px;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">Dear ${name},</p>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Your Message:</h3>
              <p style="color: #555; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              If you have any urgent matters, please don't hesitate to contact us directly at <strong>${process.env.SENDER_EMAIL}</strong>.
            </p>
            
            <p style="color: #555; margin-bottom: 0;">Best regards,<br><strong>${process.env.SENDER_NAME}</strong></p>
          </div>
          
          <div style="text-align: center; margin-top: 12px;">
            <img src="${FOOTER_IMAGE}" alt="Intmavens" style="width: 100%; max-width: 600px; display: block;" />
          </div>
        </div>
      `;
      
      const userInfo = await transporter.sendMail({
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: userSubject,
        html: userHtml,
      });
      results.userEmail = userInfo;
      console.log(`✅ User confirmation email sent (${templateType}):`, email);
    } catch (userError) {
      console.error(`❌ Failed to send user email (${templateType}):`, userError.message);
      results.userEmail = null;
      results.userError = userError.message;
    }
    
    // Check if at least one email was sent successfully
    if (!results.adminEmail && !results.userEmail) {
      throw new Error('Failed to send both emails. Please try again later.');
    }
    
    return results;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    throw error;
  }
}


async function sendRawEmail(options) {
  try {
    const mailOptions = {
      from: options.from || `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Raw email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send raw email:', error.message);
    throw error;
  }
}


async function sendBulkEmails(recipients, subject, html) {
  try {
    const results = {};

    for (const recipient of recipients) {
      try {
        const info = await transporter.sendMail({
          from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
          to: recipient.email,
          subject,
          html,
        });
        results[recipient.email] = { success: true, messageId: info.messageId };
        console.log(`✅ Bulk email sent to:`, recipient.email);
      } catch (error) {
        results[recipient.email] = { success: false, error: error.message };
        console.error(`❌ Failed to send bulk email to:`, recipient.email, error.message);
      }
    }

    return results;
  } catch (error) {
    console.error('❌ Bulk email service error:', error.message);
    throw error;
  }
}

module.exports = { 
  sendEmail, 
  sendRawEmail,
  sendBulkEmails,
};
