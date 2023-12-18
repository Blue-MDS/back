const { verify } = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    return res.status(404).json({error: 'not login'});
  }
  try {
    const goodToken = verify(token, 'mysecretToken');
    req.credentials = goodToken;
    if (goodToken) {
      next();
    }
    else {
      return res.status(404).json({error: 'error token'});
    }
  }
  catch (err) {
    return res.send({error: err});
  }
};

module.exports = {checkToken};
