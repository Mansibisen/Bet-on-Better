const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
	}
	if(req.baseUrl == "/charity") res.redirect("/charity/login");
	else res.redirect("/donor/login");
};

module.exports.isLoggedIn = isLoggedIn;
