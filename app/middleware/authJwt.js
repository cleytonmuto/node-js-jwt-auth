'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let role of roles) {
        if (role.name === 'admin') {
          next();
          return;
        }
      }
      res.status(403).send({
        message: 'Require Admin Role!'
      });
      return;
    });
  });
};

const isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'moderator') {
          next();
          return;
        }
      }
      res.status(403).send({
        message: 'Require Moderator Role!'
      });
    });
  });
};

const isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let role of roles) {
        if (role.name === 'moderator') {
          next();
          return;
        }
        if (role.name === 'admin') {
          next();
          return;
        }
      }
      res.status(403).send({
        message: 'Require Moderator or Admin Role!'
      });
    });
  });
};

module.exports = { verifyToken, isAdmin, isModerator, isModeratorOrAdmin };
