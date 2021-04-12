const client = require('./client');

const createRoutine = async ({ creatorId, isPublic, name, goal }) => {
    try {
        const { rows: [routine] } = await client.query(`
            INSERT INTO routines( "creatorId", "isPublic", name, goal )
            VALUES ( $1, $2, $3, $4 )
            RETURNING *;
        `, [ creatorId, isPublic, name, goal ]);
        return routine;
    } catch (error) {
        throw error;
    }
};

const getRoutinesWithoutActivities = async () => {
    try {
        const { rows: routines } = await client.query(`
            SELECT * FROM routines;
        `);
        return routines;
    } catch (error) {
        throw error;
    }
};

const getAllRoutines = async () => {
    try {
        const { rows : queriedRoutines } = await client.query(`
            SELECT  *
            FROM routines r
            LEFT JOIN 
                (SELECT duration, 
                count, 
                "routineId" AS id, 
                "activityId"
                FROM routine_activities) ra
            ON (r.id = ra.id)
            LEFT JOIN 
                (SELECT id AS "activityId", 
                name AS "activityName", 
                description
                from activities) a
            ON (ra."activityId" = a."activityId")
            INNER JOIN 
                (SELECT  
                id AS "creatorId",
                username AS "creatorName"
                FROM users) u
            ON (r."creatorId" = u."creatorId")
        ;`);
        
        const routines = [];
        let prevId = 0;
        let activities = [];
        let activity = {};
        let routine = {};
        for(let i = 0; i < queriedRoutines.length; i++){
            if(!queriedRoutines[i].activityId || i === queriedRoutines.length-1) {
                routine = queriedRoutines[i]
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
            }

            activity = {
                id: queriedRoutines[i].activityId,
                name: queriedRoutines[i].activityName,
                description: queriedRoutines[i].description,
                count: queriedRoutines[i].count,
                duration: queriedRoutines[i].duration
            };
            activities.push(activity);

            if(queriedRoutines[i].id !== prevId && i !== 0){
                routine = queriedRoutines[i-1];
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
                activities = [];
            }

            prevId = queriedRoutines[i].id;
        }

        return routines;
    } catch (error) {
        throw error;
    }
};


const getAllPublicRoutines = async () => {
    try {
        const { rows : queriedRoutines } = await client.query(`
            SELECT  *
            FROM routines r
            INNER JOIN 
                (SELECT duration, 
                count, 
                "routineId" AS id, 
                "activityId"
                FROM routine_activities) ra
            ON (r.id = ra.id)
            INNER JOIN 
                (SELECT id AS "activityId", 
                name AS "activityName", 
                description
                from activities) a
            ON (ra."activityId" = a."activityId")
            INNER JOIN 
                (SELECT  
                id AS "creatorId",
                username AS "creatorName"
                FROM users) u
            ON (r."creatorId" = u."creatorId")
            WHERE "isPublic" = true
        ;`);

        
        const routines = [];
        let prevId = 0;
        let activities = [];
        let activity = {};
        let routine = {};
        for(let i = 0; i < queriedRoutines.length; i++){
            if(!queriedRoutines[i].activityId || i === queriedRoutines.length-1) {
                routine = queriedRoutines[i]
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
            }

            activity = {
                id: queriedRoutines[i].activityId,
                name: queriedRoutines[i].activityName,
                description: queriedRoutines[i].description,
                count: queriedRoutines[i].count,
                duration: queriedRoutines[i].duration
            };
            activities.push(activity);

            if(queriedRoutines[i].id !== prevId && i !== 0){
                routine = queriedRoutines[i-1];
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
                activities = [];
            }

            prevId = queriedRoutines[i].id;
        }


        return routines;
    } catch (error) {
        throw error;
    }
};

const getAllRoutinesByUser = async ({username}) => {
    try {
        const { rows : queriedRoutines } = await client.query(`
            SELECT  *
            FROM routines r
            INNER JOIN 
                (SELECT duration, 
                count, 
                "routineId" AS id, 
                "activityId"
                FROM routine_activities) ra
            ON (r.id = ra.id)
            INNER JOIN 
                (SELECT id AS "activityId", 
                name AS "activityName", 
                description
                from activities) a
            ON (ra."activityId" = a."activityId")
            INNER JOIN 
                (SELECT  
                id AS "creatorId",
                username AS "creatorName"
                FROM users) u
            ON (r."creatorId" = u."creatorId")
            WHERE "creatorName" = $1
        ;`,[username]);

        
        const routines = [];
        let prevId = 0;
        let activities = [];
        let activity = {};
        let routine = {};
        for(let i = 0; i < queriedRoutines.length; i++){
            if(!queriedRoutines[i].activityId || i === queriedRoutines.length-1) {
                routine = queriedRoutines[i]
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
            }

            activity = {
                id: queriedRoutines[i].activityId,
                name: queriedRoutines[i].activityName,
                description: queriedRoutines[i].description,
                count: queriedRoutines[i].count,
                duration: queriedRoutines[i].duration
            };
            activities.push(activity);

            if(queriedRoutines[i].id !== prevId && i !== 0){
                routine = queriedRoutines[i-1];
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
                activities = [];
            }

            prevId = queriedRoutines[i].id;
        }


        return routines;
    } catch (error) {
        throw error;
    }
};

const getPublicRoutinesByUser = async ({username}) => {
    try {
        const { rows : queriedRoutines } = await client.query(`
            SELECT  *
            FROM routines r
            INNER JOIN 
                (SELECT duration, 
                count, 
                "routineId" AS id, 
                "activityId"
                FROM routine_activities) ra
            ON (r.id = ra.id)
            INNER JOIN 
                (SELECT id AS "activityId", 
                name AS "activityName", 
                description
                from activities) a
            ON (ra."activityId" = a."activityId")
            INNER JOIN 
                (SELECT  
                id AS "creatorId",
                username AS "creatorName"
                FROM users) u
            ON (r."creatorId" = u."creatorId")
            WHERE "creatorName" = $1
            AND "isPublic" = true
        ;`,[username]);

        
        const routines = [];
        let prevId = 0;
        let activities = [];
        let activity = {};
        let routine = {};
        for(let i = 0; i < queriedRoutines.length; i++){
            if(!queriedRoutines[i].activityId || i === queriedRoutines.length-1) {
                routine = queriedRoutines[i]
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
            }

            activity = {
                id: queriedRoutines[i].activityId,
                name: queriedRoutines[i].activityName,
                description: queriedRoutines[i].description,
                count: queriedRoutines[i].count,
                duration: queriedRoutines[i].duration
            };
            activities.push(activity);

            if(queriedRoutines[i].id !== prevId && i !== 0){
                routine = queriedRoutines[i-1];
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
                activities = [];
            }

            prevId = queriedRoutines[i].id;
        }


        return routines;
    } catch (error) {
        throw error;
    }
};

const getPublicRoutinesByActivity = async ({id: activityId}) => {
    try {
        const { rows : queriedRoutines } = await client.query(`
            SELECT  *
            FROM routines r
            INNER JOIN 
                (SELECT duration, 
                count, 
                "routineId" AS id, 
                "activityId"
                FROM routine_activities) ra
            ON (r.id = ra.id)
            INNER JOIN 
                (SELECT id AS "activityId", 
                name AS "activityName", 
                description
                from activities) a
            ON (ra."activityId" = a."activityId")
            INNER JOIN 
                (SELECT  
                id AS "creatorId",
                username AS "creatorName"
                FROM users) u
            ON (r."creatorId" = u."creatorId")
            WHERE ra."activityId" = $1
            AND "isPublic" = true
        ;`,[activityId]);

        
        const routines = [];
        let prevId = 0;
        let activities = [];
        let activity = {};
        let routine = {};
        for(let i = 0; i < queriedRoutines.length; i++){
            // remember that you have an edge case when i = 0
            // and when i = length
            //
            if(queriedRoutines[i].id !== prevId && i !== 0){
                //we need to put routine inside the routines array
                routine = queriedRoutines[i-1];
                delete routine.activityId;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                delete routine.activityName;
                routine.activities = activities;
                routines.push(routine);
                activities = [];
                
                //common steps between cases
            }
            activity = {
                id: queriedRoutines[i].activityId,
                name: queriedRoutines[i].activityName,
                description: queriedRoutines[i].description,
                count: queriedRoutines[i].count,
                duration: queriedRoutines[i].duration
            };
            activities.push(activity);
            //non edge-case
          //  if(queriedroutines[i].id === previd){
          //      activity = {
          //          id: queriedroutines[i].activityid,
          //          name: queriedroutines[i].name,
          //          description: queriedroutines[i].description
          //      }
          //      activities.push(activity);
          //  }

            if(i === queriedRoutines.length-1){
                routine = queriedRoutines[i];
                delete routine.activityId;
                delete routine.activityName;
                delete routine.description;
                delete routine.duration;
                delete routine.count;
                routine.activities = activities;
                routines.push(routine);
            }
            prevId = queriedRoutines[i].id;
        }

        return routines;
    } catch (error) {
        throw error;
    }
};

const updateRoutine = async ({id, ...fields }) => {
    const fieldKeys = Object.keys(fields);

    const setString = fieldKeys.map((fieldName, index) => {
        if (fieldName === 'isPublic'){
            fieldName = '"isPublic"'
        }
        return `${fieldName}=$${index+1}`
    }).join(', ');

    const setValues = Object.values(fields);
    setValues.push(id);

    if (fieldKeys.length === 0) { 
        return; 
    }

    try {
        const { rows: [routine] } = await client.query(`
            UPDATE routines
            SET ${setString}
            WHERE id = $${setValues.length}
            RETURNING *;
        `, setValues);

        return routine;
    } catch (error) {
        throw error;
    }
};

const getRoutineById = async (id) => {
    try {
        const { rows: [ routine ] } = await client.query(`
            SELECT * FROM routines
            WHERE id = $1;
        `, [id]);
        return routine;
    } catch (error) {
        throw error;
    }
}

const destroyRoutine = async (id) => {
    try {
        const { rows: [routine] } = await client.query(`
           DELETE FROM routines
           WHERE id=$1
           RETURNING *;
        `, [id]);

        await client.query(`
           DELETE FROM routine_activities
           WHERE "routineId"=$1;
        `, [id]);
        return routine;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createRoutine,
    getRoutinesWithoutActivities,
    getAllRoutines,
    updateRoutine,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    getRoutineById,
    destroyRoutine,
};