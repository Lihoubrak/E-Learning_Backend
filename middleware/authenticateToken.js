const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
function checkRole(role) {
  return function (req, res, next) {
    const token = req.headers['authorization'] || req.query.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userRole = decoded.role;

      if (userRole === role) {
        req.user = decoded;
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    });
  };
}
function generateToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '3d' }
  );
  return token;
}
module.exports = { checkRole, generateToken };
