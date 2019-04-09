var express = require('express');
var router = express.Router();
var Time = require('../controller/time-controller');
var Perfil = require('../models/Perfil');

/* GET ALL TIME */
router.get('/', function (req, res, next) {
    Time.find(function (err, bolos) {
        if (err) return next(err);
        res.json(bolos);
    });
});

router.get('/torcedores', function(req, res, next) {
    Time.find(function(err, times){
        if(err) return next(err);
        times.forEach(function(v, k){
            Perfil.count({time: v._id}, function(err, c){
                if(err) throw err;

                v.torcedores = c;
                console.log(v);
                Time.findByIdAndUpdate(v._id, v, function (err, post) {
                    if (err) return next(err);

                    console.log(k, times);
                    if(k + 1 == times.length){
                        res.json(times);
                    }
                });
            });
        });
    });
});

router.get('/ranking', function(req, res, next) {
    Time.find({torcedores: {$gt: 0}}).sort({torcedores: -1}).exec(function(err, times){
        if(err) return next(err);
        
        res.json(times);
    });
});

/* GET SINGLE TIME BY ID */
router.get('/:id', function (req, res, next) {
    Time.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


/* SAVE TIME */
// router.post('/', function (req, res, next) {
//     Time.create(req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

/* UPDATE TIME */
// router.put('/:id', function (req, res, next) {
//     Time.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

/* DELETE TIME */
// router.delete('/:id', function (req, res, next) {
//     Time.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

module.exports = router;
