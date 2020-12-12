const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {
    // Endpoint to create a new post

    let text = request.body.text;
    let media = request.body.media

    if (!text && !media) {
        response.status(406).json({
            code: 'missing post entries',
            message: 'Cannot submit empty post. Enter text, media, or both'
        })
        return;
    }

    if (media.url && media.type === null) {
        response.status(401).json({
            code: 'missing media type',
            message: 'Choose the media type of URL'
        })
        return;
    }

    let post = {
        userId: request.currentUser.id,
        text,
        media
    }

    PostModel.create(post, (post) => {
        response.status(201).json(post)
    });

});


router.put('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to like a post
    PostModel.like(request.currentUser.id, request.params.postId, (like) => {
        response.status(201).json(like)
    });
});

router.delete('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to unlike a post
    PostModel.unlike(request.currentUser.id, request.params.postId, (unlike) => {
        response.status(205).json(unlike)
    })
});

module.exports = router;
