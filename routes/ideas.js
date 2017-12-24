const express = require('express');
const mongoose = require('mongoose');

const router = express.Router()
const {
    ensureAuthenticated
} = require('../helper/auth');
// Load Idea Model
require('../models/Ideas');

const Idea = mongoose.model('ideas');



router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.get('/', ensureAuthenticated, (req, res) => {

    Idea.find({
        user: req.user.id
    }).sort({
        date: 'desc'
    }).then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    })

});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save().then(idea => {
            req.flash('success_msg', 'Idea updated')

            res.redirect('/ideas');
        });
    })
});


router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(idea => {
        req.flash('success_msg', 'Idea removed')
        res.redirect('/ideas');
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {

    Idea.findOne({
        _id: req.params.id
    }).then(
        idea => {
            if (req.user.id != req.user.id) {
                req.flash('error_msg', "Not Authorized");
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                })
            }
        }
    )
});

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details'
        });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newIdea).save()
            .then(idea => {
                req.flash('success_msg', 'Idea added');
                res.redirect('/ideas');
            })
    }
});

module.exports = router;