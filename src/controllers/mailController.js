const { sendEmail } = require('../services/mailService');

/**
 * Handle contact form submissions
 */
async function handleContactMail(req, res) {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, phone, message',
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    // Send emails
    const results = await sendEmail('CONTACT', { name, email, phone, message });
    
    res.json({
      ok: true,
      message: 'Contact form submitted successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Contact mail error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to submit contact form. Please try again later.',
    });
  }
}

/**
 * Handle career form submissions
 */
async function handleCareerMail(req, res) {
  try {
    const { name, email, phone, role, message } = req.body;
    
    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, phone',
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    // Send emails
    const results = await sendEmail('CAREER', { 
      name, 
      email, 
      phone, 
      role: role || 'Not Specified',
      message: message || 'No cover letter provided',
    });
    
    res.json({
      ok: true,
      message: 'Career application submitted successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Career mail error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to submit career application. Please try again later.',
    });
  }
}

/**
 * Handle blog comment/inquiry submissions
 */
async function handleBlogMail(req, res) {
  try {
    const { name, email, phone, message, postTitle } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, message',
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    // Send emails
    const results = await sendEmail('BLOG', { 
      name, 
      email, 
      phone: phone || 'Not provided',
      message,
      postTitle: postTitle || 'Blog Post Comment',
    });
    
    res.json({
      ok: true,
      message: 'Blog comment submitted successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Blog mail error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to submit blog comment. Please try again later.',
    });
  }
}

/**
 * Generic mail handler for any template type
 */
async function handleSendMail(req, res) {
  try {
    const { templateType, name, email, message, ...rest } = req.body;
    
    // Validation
    if (!templateType || !name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: templateType, name, email, message',
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    // Send emails
    const results = await sendEmail(templateType, { name, email, message, ...rest });
    
    res.json({
      ok: true,
      message: 'Email sent successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Mail sending error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Failed to send email. Please try again later.',
    });
  }
}

module.exports = { 
  handleContactMail, 
  handleCareerMail, 
  handleBlogMail,
  handleSendMail,
};
