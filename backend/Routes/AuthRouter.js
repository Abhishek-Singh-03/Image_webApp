const {signup, login} = require('../Controllers/Auth');
const { signupValidation, loginValidation} = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.get('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

module.exports = router;