// Validation middleware for various endpoints

const validateLessonCreation = (req, res, next) => {
  const { title, description, category, emotionalTone, visibility, accessLevel } = req.body;

  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  if (title && title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  if (description && description.length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }

  // Category validation
  const validCategories = [
    'Personal Growth', 'Career', 'Relationships', 'Mindset', 
    'Mistakes Learned', 'Health', 'Finance', 'Spirituality', 'Other'
  ];
  if (!category || !validCategories.includes(category)) {
    errors.push('Invalid category');
  }

  // Emotional tone validation
  const validEmotionalTones = [
    'Motivational', 'Sad', 'Realization', 'Gratitude', 
    'Warning', 'Hopeful', 'Reflective', 'Inspirational', 'Other'
  ];
  if (!emotionalTone || !validEmotionalTones.includes(emotionalTone)) {
    errors.push('Invalid emotional tone');
  }

  // Visibility validation
  const validVisibilities = ['public', 'private'];
  if (!visibility || !validVisibilities.includes(visibility)) {
    errors.push('Invalid visibility option');
  }

  // Access level validation
  const validAccessLevels = ['free', 'premium'];
  if (!accessLevel || !validAccessLevels.includes(accessLevel)) {
    errors.push('Invalid access level');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }

  next();
};

const validateUserUpdate = (req, res, next) => {
  const { name, photoURL } = req.body;

  const errors = [];

  // Name validation
  if (name && (typeof name !== 'string' || name.trim().length < 2)) {
    errors.push('Name must be at least 2 characters long');
  }
  if (name && name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  // PhotoURL validation (optional)
  if (photoURL && typeof photoURL !== 'string') {
    errors.push('Photo URL must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }

  next();
};

const validateReport = (req, res, next) => {
  const { lessonId, reason } = req.body;

  const errors = [];

  // Lesson ID validation
  if (!lessonId || typeof lessonId !== 'string') {
    errors.push('Lesson ID is required');
  }

  // Reason validation
  const validReasons = [
    'Inappropriate Content',
    'Hate Speech or Harassment',
    'Misleading or False Information',
    'Spam or Promotional Content',
    'Sensitive or Disturbing Content',
    'Other'
  ];
  if (!reason || !validReasons.includes(reason)) {
    errors.push('Invalid reason for report');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }

  next();
};

const validateComment = (req, res, next) => {
  const { text } = req.body;

  const errors = [];

  // Comment text validation
  if (!text || typeof text !== 'string' || text.trim().length < 1) {
    errors.push('Comment text is required');
  }
  if (text && text.length > 1000) {
    errors.push('Comment must be less than 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }

  next();
};

const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  // Page validation
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({ 
      message: 'Page must be a positive integer' 
    });
  }

  // Limit validation
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({ 
      message: 'Limit must be between 1 and 100' 
    });
  }

  next();
};

module.exports = {
  validateLessonCreation,
  validateUserUpdate,
  validateReport,
  validateComment,
  validatePagination
};
