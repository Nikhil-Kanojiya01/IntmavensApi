const HEADER_IMAGE = 'https://res.cloudinary.com/ddgd5aq1u/image/upload/v1765443568/Add_a_heading_1_via4n9.png';
const FOOTER_IMAGE = 'https://res.cloudinary.com/ddgd5aq1u/image/upload/v1765443577/Add_a_heading_4_g7eoqs.png';

module.exports = function contactTemplate(data) {
  const { name, email, phone, message } = data;
  
  return {
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center;">
          <img src="${HEADER_IMAGE}" alt="Intmavens" style="width: 100%; max-width: 600px; display: block;" />
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
          
          <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 12px;">
          <img src="${FOOTER_IMAGE}" alt="Intmavens" style="width: 100%; max-width: 600px; display: block;" />
        </div>
      </div>
    `,
  };
};
