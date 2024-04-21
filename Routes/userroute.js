const express = require('express');
const router = express.Router();
const controller = require('./controller');
const UserDB = require('../Models/users');


router.post('/signup',controller.create);
router.post('/login',controller.login);

// router.get('/api/users', controller.find);
// router.put('/api/users/:id', controller.update);
// router.delete('/api/users/:id', controller.delete);




router.post('/newblog',controller.createBlog);
router.get('/api/blogs', controller.findblog);
router.put('/update', controller.updateBlog);
router.delete('/api/blogs/:id', controller.delete);

module.exports = router;