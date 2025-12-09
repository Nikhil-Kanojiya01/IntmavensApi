const express = require('express');
const { 
  handleContactMail, 
  handleCareerMail, 
  handleBlogMail,
  handleSendMail,
} = require('../controllers/mailController');

const router = express.Router();

/**
 * Contact form endpoint
 * POST /api/mail/contact
 * Body: { name, email, phone, message }
 */
router.post('/contact', handleContactMail);

/**
 * Career application endpoint
 * POST /api/mail/career
 * Body: { name, email, phone, role, message }
 */
router.post('/career', handleCareerMail);

/**
 * Blog comment/inquiry endpoint
 * POST /api/mail/blog
 * Body: { name, email, phone, message, postTitle }
 */
router.post('/blog', handleBlogMail);

/**
 * Generic email endpoint (backward compatible)
 * POST /api/mail/send
 * Body: { templateType, name, email, message, ...otherFields }
 */
router.post('/send', handleSendMail);

module.exports = router;
