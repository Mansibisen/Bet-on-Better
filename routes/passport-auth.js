module.exports = {
	ensureAuth: function(req, res, next) {
	  if (req.isAuthenticated()) {
		return next();
	  }
	  res.redirect('/login');
	},
	forwardAuth: function(req, res, next) {
	  if (!req.isAuthenticated()) {
		return next();
	  }
	  res.redirect('/');      
	}
  };