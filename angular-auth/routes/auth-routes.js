const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const router = express.Router();

router.post('/signup', (req, res, next) =>{
const username = req.body.username;
const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({message: 'Provide Username and Passord'});
    return;
  }

    User.findOne({username: username}, '_id', (err, foundUser) => {
  if (foundUser) {
    res.status(400).json({message: 'This username already exists'});
    return;
  }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User ({
      username: username,
      password: hasPass
    });
    theUser.save((err) =>{
      if (err){
        res.status(500).json({message: "Something went wrong"});
      }
      res.status(200).json({theUser});
    });
  });
});

module.exports = router;
