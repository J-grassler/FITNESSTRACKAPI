const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const { createUser, getUser } = require('../db/users');
const { getPublicRoutinesByUser } = require('../db/routines');
const { requireUser } = require('./utils');

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (password.length < 8) {
            return next({message: 'Password Too Short!'});
        }

        const dupeUser = await getUser({username, password});
        if (dupeUser) {
            return next({message: 'A user by that username already exists'});
        }

        const user = await createUser({username, password});
        res.send({user});
    } catch (error) {
        next(error)
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await getUser({username, password});
        const token = jwt.sign(user, JWT_SECRET);
        res.send({token});
    } catch (error) {
        next(error);
    }
});

router.get('/me', requireUser, async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, JWT_SECRET);
            res.send({...user});
        } else {
            return next({message: 'You must be logged in to perform this action'});
        }
    } catch (error) {
        next(error);
    }
});

router.get('/:username/routines', async (req, res, next) => {
    try {
        const {username} = req.params;
        const routines = await getPublicRoutinesByUser({username})
        res.send(routines);
    } catch (error) {
        next(error);
    }
});


module.exports = router;