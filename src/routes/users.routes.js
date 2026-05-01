const router = require('express').Router();
const auth   = require('../middleware/auth');
const userSvc = require('../services/user.service');

router.get('/users/profile', auth, async (req, res, next) => {
  try { res.json(await userSvc.getProfile(req.user.id)); }
  catch (e) { next(e); }
});

module.exports = router;
