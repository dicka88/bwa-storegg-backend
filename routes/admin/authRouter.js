const { Router } = require("express");
const logoutController = require("../../app/controller/auth/logoutController");
const signinController = require("../../app/controller/auth/signinController");

const router = new Router();

router.get('/', signinController.index);
router.post('/signin', signinController.signinAction);
router.get('/logout', logoutController.logout);

module.exports = router;