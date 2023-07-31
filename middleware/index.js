const admin = require('../config/firebase-config');
class Middleware {
	async decodeToken(req, res, next) {
		// console.log(req.headers);
		// console.log(req.body);
		const token = req.headers.authorization;
		// console.log(token);
		try {
			const decodeValue = await admin.auth().verifyIdToken(token);
			// console.log(decodeValue);
			if (decodeValue) {
				// console.log("hello");
				req.user = decodeValue;
				// req.email=decodeValue.email;
				// console.log(req.email);
				return next();
			}
			return res.json({ message: 'Un authorize' });
		} catch (e) {
			return res.json({ message: 'Internal Error' });
		}
	}
}

module.exports = new Middleware();