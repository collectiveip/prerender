module.exports = {
	requestReceived: (req, res, next) => {
		let auth = req.headers.authorization;
		if (!auth) return res.send(401);

		// malformed
		let parts = auth.split(' ');
		if ('bearer' != parts[0].toLowerCase()) return res.send(401);
		if (!parts[1]) return res.send(401);
		auth = parts[1];

		if (auth !== process.env.PRERENDER_TOKEN) return res.send(401);

		req.prerender.authentication = {
			token: auth[1]
		};

		return next();
	}
}
