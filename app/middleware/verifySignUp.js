'use strict';

const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: 'Failed! Username is already in use!'
      });
      return;
    }
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: 'Failed! Email is already in use!'
        });
        return;
      }
      next();
    });
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let role of req.body.roles) {
      if (!ROLES.includes(role)) {
        res.status(400).send({
          message: 'Failed! Role does not exist = ' + role
        });
        return;
      }
    }
  }
  next();
};

module.exports = { checkDuplicateUsernameOrEmail, checkRolesExisted };