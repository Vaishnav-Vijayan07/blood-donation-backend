const User = require('../models/user');

const generateLoginId = async () => {
  const count = await User.count();
  return `KSESA${String(count + 1).padStart(3, '0')}`;
};

module.exports = generateLoginId;