var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
 
  let token = req.headers.authorization || req.headers.Authorization;
  if (!token)
    return res.status(403).send({ 'status': false, 'errorMessage': 'No token provided' });

  token = token.replace(/^Bearer\s+/, "");

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return res.status(401).send({ 'status': false, 'message': 'Failed to authenticate token' });

    req.userId = decoded.id;
    req.email = decoded.email;
    req.name = decoded.name;

    next();
  })
}


module.exports = verifyToken;