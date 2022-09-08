const { PrismaClient } = require('@prisma/client');
var express = require('express');
var bcrypt = require('bcrypt');
var { body, validationResult } = require('express-validator');
var prisma = new PrismaClient();
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
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hash,
      },
      Role: {
        connect: {
          where: {
            name: "EMPLOYEE"
          },
        }
      }
    });
    res.status(200).json({"success": true, user: user });  
  } catch (e) {
    res.status(400).json({ error: e });
    throw e;
  }
})

/* POST login a user */
router.post('/login', function(req, res, next) {
  res.status(200).json({"success": true});
})

module.exports = router;
