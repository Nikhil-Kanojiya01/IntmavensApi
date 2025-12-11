module.exports = function blogTemplate(data) {
  const { name, email, message, website } = data;
  
  return {
    subject: `New Blog Comment from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Blog Engagement</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Comment or Inquiry Received</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-left: 4px solid #4facfe;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">Visitor Information</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #4facfe; width: 30%;">Name:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #4facfe;">Email:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="mailto:${email}" style="color: #4facfe; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${website && website !== 'Not provided' ? `
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #4facfe;">Website:</td>
              <td style="padding: 12px 0 12px 20px; color: #333;">
                <a href="${website}" target="_blank" style="color: #4facfe; text-decoration: none;">${website}</a>
              </td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 4px; border-left: 4px solid #4facfe;">
            <h3 style="margin-top: 0; color: #333;">Comment / Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #2196F3;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>Action:</strong> Consider moderating this comment before publishing on your blog.
            </p>
          </div>
        </div>
        
        <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p style="margin: 0;">This is an automated email from your website blog comment system.</p>
          <p style="margin: 5px 0 0 0;">Please review and respond to ${email} if necessary.</p>
        </div>
      </div>
    `,
  };
};
