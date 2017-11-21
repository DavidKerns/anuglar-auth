const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const userRouter = express.Router();

userRouter.post('/signup', (req, res, next) =>{
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
      password: hashPass
    });
    theUser.save((err) =>{
      if (err){
        res.status(500).json({message: "Something went wrong with saving"});
      }
      req.login(theUser, (err) =>{
        if (err){
          res.status(500).json({message: "Something went wrong with login"});
        }
        theUser.password = undefined;
        res.status(200).json({theUser});
      });

    });
  });
});

userRouter.post('/login', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username}, (err, foundUser) => {
    if (!foundUser) {
        res.status(400).json({message: "Incorrect Username"});
        return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)){
      res.status(400).json({message: "Incorrect password"});
      return;
    }
    req.login(foundUser, (err) => {
      if (err){
        res.status(500).json({message: "Something went wrong login"});
      }
      foundUser.password = undefined;
      res.status(200).json(foundUser);
    });
  });
});

userRouter.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

userRouter.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});
userRouter.get('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});
module.exports = userRouter;
