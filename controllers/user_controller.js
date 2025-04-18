const bcrypt = require('bcrypt');
const { body, query } = require('express-validator');
const validate = require('../middlewares/validate_middleware');
const User = require('../models/user');
const Office = require('../models/office');
const generateLoginId = require('../utils/generate_login_id');
const multer = require('multer');
const { UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG and PNG images are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const userValidation = [
  body('rank').notEmpty().withMessage('Rank is required'),
  body('blood_group').notEmpty().withMessage('Blood Group is required'),
  body('mobile_number').notEmpty().withMessage('Mobile Number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('date_of_birth').isDate().withMessage('Valid date of birth is required'),
  body('service_start_date').isDate().withMessage('Valid service start date is required'),
  body('residential_address').notEmpty().withMessage('Residential Address is required'),
  body('office_id').isInt().withMessage('Valid Office ID is required'),
];

const profileUpdateValidation = [
  body('mobile_number').optional().notEmpty().withMessage('Mobile Number is required'),
  body('residential_address').optional().notEmpty().withMessage('Residential Address is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.createUser = [
  upload.single('profile_photo'),
  userValidation,
  validate,
  async (req, res) => {
    try {
      console.log('Raw request body:', req.body);
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty or not JSON' });
      }

      const {
        rank,
        blood_group,
        mobile_number,
        email,
        password,
        date_of_birth,
        service_start_date,
        residential_address,
        office_id,
      } = req.body;

      console.log('Destructured fields:', {
        rank,
        blood_group,
        mobile_number,
        email,
        password,
        date_of_birth,
        service_start_date,
        residential_address,
        office_id,
      });

      if (!rank || !blood_group || !mobile_number || !email || !password || !date_of_birth || !service_start_date || !residential_address || !office_id) {
        return res.status(400).json({ error: 'Missing required fields', received: req.body });
      }

      const office = await Office.findByPk(office_id);
      if (!office) {
        return res.status(400).json({ error: 'Office ID does not exist' });
      }

      const login_id = await generateLoginId();
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        login_id,
        rank,
        blood_group,
        mobile_number,
        email,
        password: hashedPassword,
        date_of_birth,
        service_start_date,
        residential_address,
        profile_photo: req.file ? req.file.path : null,
        office_id,
      });

      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user.get({ plain: true });
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof UniqueConstraintError) {
        if (error.fields.email) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        if (error.fields.login_id) {
          return res.status(400).json({ error: 'Login ID already exists' });
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json({ error: 'Office ID does not exist' });
      }
      res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
  },
];

exports.getUsers = [
  query('blood_group').optional().isString(),
  query('office_id').optional().isInt(),
  query('rank').optional().isString(),
  validate,
  async (req, res) => {
    try {
      const { blood_group, office_id, rank } = req.query;
      const where = {};
      if (blood_group) where.blood_group = blood_group;
      if (office_id) where.office_id = office_id;
      if (rank) where.rank = rank;

      const users = await User.findAll({
        where,
        include: [Office],
        order: [['rank', 'ASC']],
        attributes: { exclude: ['password'] }, // Exclude password
      });
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
  },
];

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Office],
      attributes: { exclude: ['password'] }, // Exclude password
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

exports.updateUser = [
  upload.single('profile_photo'),
  userValidation,
  validate,
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const {
        rank,
        blood_group,
        mobile_number,
        email,
        password,
        date_of_birth,
        service_start_date,
        residential_address,
        office_id,
      } = req.body;

      if (office_id) {
        const office = await Office.findByPk(office_id);
        if (!office) {
          return res.status(400).json({ error: 'Office ID does not exist' });
        }
      }

      const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

      await user.update({
        rank,
        blood_group,
        mobile_number,
        email,
        password: hashedPassword,
        date_of_birth,
        service_start_date,
        residential_address,
        profile_photo: req.file ? req.file.path : user.profile_photo,
        office_id,
      });

      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user.get({ plain: true });
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof UniqueConstraintError) {
        if (error.fields.email) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        if (error.fields.login_id) {
          return res.status(400).json({ error: 'Login ID already exists' });
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json({ error: 'Office ID does not exist' });
      }
      res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
  },
];

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

exports.getOwnProfile = async (req, res) => {
  console.log("req.user.id ======>", req.user.id);
  
  try {
    const user = await User.findByPk(req.user.id, {
      include: [Office],
      attributes: { exclude: ['password'] }, // Exclude password
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching own profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
};

exports.updateOwnProfile = [
  upload.single('profile_photo'),
  profileUpdateValidation,
  validate,
  async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { mobile_number, residential_address, password } = req.body;

      const updates = {};
      if (mobile_number) updates.mobile_number = mobile_number;
      if (residential_address) updates.residential_address = residential_address;
      if (password) updates.password = await bcrypt.hash(password, 10);
      if (req.file) updates.profile_photo = req.file.path;

      await user.update(updates);

      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user.get({ plain: true });
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating own profile:', error);
      res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
  },
];