import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../../controller/public/DonVi'

let router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/\*', controller.getTable);

module.exports = router;