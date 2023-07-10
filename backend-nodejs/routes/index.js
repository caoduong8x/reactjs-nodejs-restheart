import express from 'express'
import moment from 'moment'
import bodyParser from 'body-parser'

let usersRouter = require('./users');
let authRouter = require('./auth');
let dataRouter = require('./data');
let mediaRouter = require('./media');
let generalRouter = require('./general');
let publicRouter = require('./public');
let guestRouter = require('./guest');
let aggrsRouter = require('./aggrs');

let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.json());


router.use('/auth', authRouter);
router.use('/users', mwJson.checkJson, usersRouter);
router.use('/data', dataRouter);
router.use('/general', generalRouter);
router.use('/media', mediaRouter);
router.use('/aggrs', aggrsRouter);

// DỊCH VỤ CHO BÊN THỨ 3
router.use('/public', publicRouter);
// DỊCH VỤ CHO KHÁCH CHƯA ĐĂNG NHẬP
router.use('/guest', guestRouter);
module.exports = router;
