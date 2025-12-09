const contactTemplate = require('./contactTemplate');
const careerTemplate = require('./careerTemplate');
const blogTemplate = require('./blogTemplate');

const TEMPLATE_TYPES = {
  CONTACT: 'CONTACT',
  CAREER: 'CAREER',
  BLOG: 'BLOG',
};

/**
 * Build email template based on template type
 * @param {string} templateType - Type of template (CONTACT, CAREER, BLOG)
 * @param {object} data - Data to populate the template
 * @returns {object} - Object with subject and html properties
 */
function buildTemplate(templateType, data) {
  switch (templateType) {
    case TEMPLATE_TYPES.CONTACT:
      return contactTemplate(data);
    
    case TEMPLATE_TYPES.CAREER:
      return careerTemplate(data);
    
    case TEMPLATE_TYPES.BLOG:
      return blogTemplate(data);
    
    default:
      throw new Error(`Unknown template type: ${templateType}. Allowed types: ${Object.values(TEMPLATE_TYPES).join(', ')}`);
  }
}

module.exports = { buildTemplate, TEMPLATE_TYPES };
