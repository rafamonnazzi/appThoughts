module.exports.checkAuth = function(req, res, next){
    const userId = req.session.userId

    if(!user){
        res.redirect('/login')
    }

    next()
}