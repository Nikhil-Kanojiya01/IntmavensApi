module.exports = function contactTemplate(data) {
  const { name, email, phone, message } = data;
  
  return {
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Contact Inquiry</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">From: Intmavens Contact Form</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-left: 4px solid #667eea;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #667eea; width: 30%;">Name:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #667eea;">Email:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #667eea;">Phone:</td>
              <td style="padding: 12px 0 12px 20px; color: #333;">
                <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
              </td>
            </tr>
          </table>
          
          <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 4px; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p style="margin: 0;">This is an automated email from your website contact form.</p>
          <p style="margin: 5px 0 0 0;">Please reply to ${email} to get in touch with the sender.</p>
        </div>
      </div>
    `,
  };
};
