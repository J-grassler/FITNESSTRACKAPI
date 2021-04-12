const express = require('express');
const router = express.Router();

const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine } = require('../db/routines');
const { addActivityToRoutine } = require('../db/routine_activities');
const { requireUser } = require('./utils');

router.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();
        res.send(routines);
    } catch (error) {
        next(error);
    }
});

router.post('/', requireUser, async (req, res, next) => {
    try {
        const { isPublic, name, goal } = req.body;
        const routine = await createRoutine({creatorId: req.user.id, isPublic, name, goal});
        res.send(routine);
    } catch (error) {
        next(error);
    }
});

router.patch('/:routineId', requireUser, async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const { isPublic, name, goal } = req.body;
        const routine = await getRoutineById(routineId);
        if (routine.creatorId === req.user.id){
            const updatedRoutine = await updateRoutine({id: routineId, isPublic, name, goal});
            return res.send(updatedRoutine);
        } else {
            next({message: 'You must be the creator of this routine'});
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const routine = await getRoutineById(routineId);
        if (routine.creatorId === req.user.id) {
            const deletedRoutine = await destroyRoutine(routineId);
            res.send(deletedRoutine);
        } else {
            next({message: 'You must be the creator of this routine'});
        }
    } catch (error) {
        next(error);
    }
});

router.post('/:routineId/activities', async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const { activityId, count, duration } = req.body;
        const ra = await addActivityToRoutine({ routineId, activityId, count, duration });
        res.send(ra);
    } catch (error) {
        next(error);
    }
});

module.exports = router;