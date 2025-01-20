const authorizeRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ message: 'Access forbidden: Insufficient role' });
  }
};

module.exports = authorizeRole;
