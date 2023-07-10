import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../../controller/data/tbCurrentPermission'

let mwJWT = require('../../middlewares/jwt');
let mwLog = require('../../middlewares/log');
let mwJson = require('../../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/\*', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.getTable);
 
module.exports = router;