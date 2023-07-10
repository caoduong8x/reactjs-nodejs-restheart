import express from 'express'
import bodyParser from 'body-parser'

let DonViRouter = require('./guest/DonVi')

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/don-vi', DonViRouter)

module.exports = router;