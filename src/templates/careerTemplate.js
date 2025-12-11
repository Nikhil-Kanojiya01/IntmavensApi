module.exports = function careerTemplate(data) {
  const { name, email, phone, role } = data;
  
  return {
    subject: `Career Application from ${name} - Position: ${role || 'Not Specified'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Career Application</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Job Application Received</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-left: 4px solid #ff6b6b;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">Applicant Information</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #ff6b6b; width: 30%;">Full Name:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #ff6b6b;">Email:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="mailto:${email}" style="color: #ff6b6b; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #ff6b6b;">Phone:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="tel:${phone}" style="color: #ff6b6b; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #ff6b6b;">Applied For:</td>
              <td style="padding: 12px 0 12px 20px; color: #333;">${role || 'Position not specified'}</td>
            </tr>
          </table>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Note:</strong> Please check attached documents (CV/Resume) if provided in the application.
            </p>
          </div>
        </div>
        
        <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p style="margin: 0;">This is an automated email from your website career portal.</p>
          <p style="margin: 5px 0 0 0;">Please review the application and contact ${email} to proceed.</p>
        </div>
      </div>
    `,
  };
};
