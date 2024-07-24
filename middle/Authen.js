const jwt = require('jsonwebtoken');

const authenWeb = (req, res, next) => {
    const { session } = req;
    const url = req.originalUrl.toLowerCase();
    if (!session) {
        // nếu chưa login
        if (url.includes('login')) {
            next();
        } else {
            res.redirect('/login');
        }
    } else {
        const { token } = session;
        if (!token) {
            if (url.includes('login')) {
                next();
            } else {
                res.redirect('/login');
            }
        } else {
            jwt.verify(token, 'secret', function (error, decoded) {
                const { role } = decoded;
                if (error) {
                    if (url.includes('login')) {
                        next();
                    } else {
                        res.redirect('/login');
                    }
                } else {
                    // nếu đã login
                    if (role === 0 || role === 1) {
                        if (url.includes('login')) {
                            // qua home
                            res.redirect('/');
                        } else {
                            next();
                        }
                    }

                }
            })
        }
    }
}

const authenUserPermission = (req, res, next) => {
    const { session } = req;
    const { token } = session;
    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, 'secret', function (error, decoded) {
        if (error) {
            return res.redirect('/login');
        }
        const { role } = decoded;
        if (role === 0) {
            next();
        } else {
            res.redirect('/');
        }
    });
};


const authenAPI = (req, res, next) => {
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] == 'Bearer')
        token = req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, 'secret', function (error, decoded) {
            if (error) {
                return res.status(401).json({ status: false })
            } else {
                return next();
            }
        })
    } else {
        return res.status(401).json({ status: false })
    }
}

module.exports = { authenWeb, authenAPI, authenUserPermission };