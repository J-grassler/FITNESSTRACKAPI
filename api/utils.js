const requireUser = (req, res, next) => {
    if (!req.user) {
        return next({message: 'You must be logged in to perform this action'});
    }
    next();
}

module.exports = {
    requireUser
}
