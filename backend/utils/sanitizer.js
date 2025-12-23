const validator = require('validator');

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return input;
    }

    // Trim whitespace
    let sanitized = input.trim();

    // Escape HTML special characters
    sanitized = validator.escape(sanitized);

    return sanitized;
};

/**
 * Sanitize an object's string values
 * @param {Object} obj - Object with user inputs
 * @param {Array<string>} fields - Fields to sanitize
 * @returns {Object} - Object with sanitized values
 */
const sanitizeObject = (obj, fields) => {
    const sanitized = { ...obj };

    fields.forEach(field => {
        if (sanitized[field] && typeof sanitized[field] === 'string') {
            sanitized[field] = sanitizeInput(sanitized[field]);
        }
    });

    return sanitized;
};

/**
 * Validate email using validator library
 * @param {string} email - Email address
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
    return validator.isEmail(email);
};

module.exports = {
    sanitizeInput,
    sanitizeObject,
    isValidEmail,
};
