const express = require('express');
const router = express.Router();

const { requireUser } = require('./utils');
const { getAllActivities, createActivity, updateActivity } = require('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');

router.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        res.send(activities);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const activity = await createActivity({ name, description });
        res.send(activity);
    } catch (error) {
        next(error);
    }
});

router.patch('/:activityId', requireUser, async (req, res, next) => {
    try { 
        const { activityId } = req.params;
        const { name, description } = req.body; 
        const activity = await updateActivity({id: activityId, name, description}); 
        res.send(activity);
    } catch (error) {
        next(error);
    }
});

router.get('/:activityId/routines', async (req, res, next) => {
    try {
        const routines = await getPublicRoutinesByActivity({id: req.params.activityId});
        res.send(routines);
    } catch (error) {
        next(error);
    }
});

module.exports = router;