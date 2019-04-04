var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Bolo = require('../models/Bolo.js');

/* GET ALL BOLOS */
router.get('/', function(req, res, next) {
  Bolo.find(function (err, bolos) {
    if (err) return next(err);
    res.json(bolos);
  });
});

/* GET SINGLE BOLO BY ID */
router.get('/:id', function(req, res, next) {
  Bolo.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE BOLO */
router.post('/', function(req, res, next) {
  Bolo.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE BOLO */
router.put('/:id', function(req, res, next) {
  Bolo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE BOLO */
router.delete('/:id', function(req, res, next) {
  Bolo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
