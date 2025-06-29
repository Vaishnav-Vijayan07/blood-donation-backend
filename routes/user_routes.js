const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const { requireAdmin, requireAuth } = require('../middlewares/auth_middleware');

console.log('auth_middleware:', { requireAdmin, requireAuth });
router.get('/me', requireAuth, userController.getOwnProfile);
router.put('/me', requireAuth, userController.updateOwnProfile);
router.post('/change-password', requireAuth, userController.changePassword);
// router.post('/reset-password', requireAdmin, userController.adminRequestPasswordChange);
router.post("/reset-password", userController.adminResetUserPassword);


router.post('/', requireAdmin, userController.createUser);
router.get('/', requireAuth, userController.getUsers);
router.get('/:id', requireAdmin, userController.getUser);
router.put('/:id', requireAdmin, userController.updateUser);
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;