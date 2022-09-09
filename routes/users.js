const { PrismaClient } = require('@prisma/client');
var express = require('express');
var bcrypt = require('bcrypt');
var { body, validationResult } = require('express-validator');
var prisma = new PrismaClient();
var utils = require('../utils/jwtutils');
var router = express.Router();

const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST create a user */
router.post('/signup', body('email').isEmail(), body('password').isLength({ min: 5 }), async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  hash = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const employeeRole = await prisma.role.findFirst({
      where: {
        name: req.body.role || "EMPLOYEE"
      }
    });
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        Role: {
          connect: {
            id: employeeRole.id, 
          }
        }
      },
    });
    res.status(200).json({"success": true, user: user });  
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
  }
})

/* POST login a user */
router.post('/login', body('email').isEmail(), body('password').isLength({min: 5}), async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email
      },
      include: {
        Role: true,
      }
    });
    if (user == null) {
      return res.status(403).json({error : "email or password incorrect"});
    }
    const isValidUser = await bcrypt.compare(req.body.password, user.password);
    if (!isValidUser) {
      return res.status(403).json({error : "email or password incorrect"});
    } else {
      var tokens = utils.generateToken(user);
      return res.status(200).json({"success": true, "token": tokens});
    }
  } catch (e) {
    console.error(e);
    res.status(403).json({ error: e });
  }
})

module.exports = router;
