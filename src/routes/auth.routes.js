const router = require('express').Router();
const { z } = require('zod');
const validate = require('../middleware/validate');
const userSvc  = require('../services/user.service');
const jwtLib   = require('../lib/jwt');
const config   = require('../config');

const signupSchema = z.object({
  full_name: z.string().min(1).max(120),
  email:     z.string().email().max(254),
  password:  z.string().min(8).max(128),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try { res.status(201).json(await userSvc.createUser(req.body)); }
  catch (e) { next(e); }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const user = await userSvc.authenticate(req.body);
    const token = jwtLib.sign({ sub: user.id, email: user.email });
    res.json({ token, token_type: 'Bearer', expires_in: config.jwt.ttlSeconds });
  } catch (e) { next(e); }
});

module.exports = router;
