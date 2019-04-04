var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Produto = require('../models/Produto.js');
var passport     = require('passport');

/* GET ALL PRODUTOS */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Produto.find(function (err, produtos) {
    if (err) return next(err);
    res.json(produtos);
  });
});

/* GET SINGLE PRODUTO BY ID */
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Produto.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE PRODUTO */
// router.post('/', function(req, res, next) {
//   Produto.create(req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

/* SAVE PRODUTO */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Produto.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
});

/* UPDATE PRODUTO */
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Produto.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE PRODUTO */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Produto.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
