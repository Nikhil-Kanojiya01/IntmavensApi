const HEADER_IMAGE = 'https://res.cloudinary.com/ddgd5aq1u/image/upload/v1765443568/Add_a_heading_1_via4n9.png';
const FOOTER_IMAGE = 'https://res.cloudinary.com/ddgd5aq1u/image/upload/v1765443577/Add_a_heading_4_g7eoqs.png';

module.exports = function careerTemplate(data) {
  const { name, email, phone, role } = data;
  
  return {
    subject: `Career Application from ${name} - Position: ${role || 'Not Specified'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center;">
          <img src="${HEADER_IMAGE}" alt="Intmavens" style="width: 100%; max-width: 600px; display: block;" />
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
        
        <div style="text-align: center; margin-top: 12px;">
          <img src="${FOOTER_IMAGE}" alt="Intmavens" style="width: 100%; max-width: 600px; display: block;" />
        </div>
      </div>
    `,
  };
};
