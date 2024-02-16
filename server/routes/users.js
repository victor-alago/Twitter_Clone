import express from 'express';
import {getUser, 
    updateUser, 
    deleteUser, 
    followUser, 
    unfollowUser,
    whoToFollow} from '../services/user.service.js';
import verify from '../verifyToken.js';

const router  = express.Router();
// get a user
router.get('/find/:username', getUser);
// get 5 users to follow
router.get('/find/',verify, whoToFollow);
// update a user
router.put('/:username', verify, updateUser);
// delete a user
router.delete('/:username', verify, deleteUser);
// follow a user
router.put('/follow/:username', verify, followUser);
// unfollow a user
router.put('/unfollow/:username', verify, unfollowUser);


export default router;