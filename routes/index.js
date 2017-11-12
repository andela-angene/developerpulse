const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const sheet = require('./getdata');

/* GET home page. */
router.get('/', (req, res) => {
  const { token } = req.query;

  if (token) {
    const decoded = jwt.decode(token);
    if (decoded) {
      const details = {
        userMail: decoded.UserInfo.email,
        userId: decoded.UserInfo.id,
        res,
      };

      return sheet.authorize(sheet.authDetails, details, sheet.render);
    }
  }

  return res.redirect('/login');
});

/* GET login page. */
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Fellow Status - Login',
    url: process.env.site_url,
  });
});

module.exports = router;
