const db = require('../database/models');

const userLoggedMiddleware = async (req,res,next) => {

    res.locals.isLogged = false

    let userFromCookie = await db.User.findOne({
        where: {
            email: req.cookies.email,
        }
    })
    .catch(function(errors){ console.log(errors);
    });

    if(userFromCookie){
        req.session.userLogged = userFromCookie
    }

    if(req.session.userLogged){
        res.locals.isLogged = true
        res.locals.userLogged = req.session.userLogged
    }
    next()
}

module.exports = userLoggedMiddleware;