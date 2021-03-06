const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const { getUserById } = require('../db/users');
const { JWT_SECRET } = process.env;

router.get('/health', (req, res, next) => {
    res.send({message: 'The server is up'});
});

router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  
  if (!auth) { 
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

router.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

router.use('/users', require('./users'));
router.use('/activities', require('./activities'));
router.use('/routines', require('./routines'));
router.use('/routine_activities', require('./routine_activities'));

module.exports = router;