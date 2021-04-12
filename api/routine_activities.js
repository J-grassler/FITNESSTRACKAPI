const express = require('express');
const router = express.Router();

const { updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity } = require('../db/routine_activities');
const { getRoutineById } = require('../db/routines');
const { requireUser } = require('./utils');

router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const { routineActivityId: id } = req.params;
        const ra = await getRoutineActivityById(id);
        const routine = await getRoutineById(ra.routineId);
        if (req.user.id === routine.creatorId) {
            const { count, duration } = req.body
            const updatedRa = await updateRoutineActivity({id, count, duration});
            res.send(updatedRa);
        } else { 
            next({message: 'You must be the owner of this Routine'});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const { routineActivityId: id } = req.params;
        const ra = await getRoutineActivityById(id);
        const routine = await getRoutineById(ra.routineId);
        if (req.user.id === routine.creatorId) {
            const deletedRa = await destroyRoutineActivity(id);
            res.send(deletedRa);
        } else { 
            next({message: 'You must be the owner of this Routine'});
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;