// Using apiRoutes/index.js as a central hub for all routing functions we may want to add to the application. 
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// Having it use the module exported from animalRoutes.js. (Note that the .js extension is implied when supplying file names in require()).
router.use(animalRoutes);

router.use(require('./zookeeperRoutes'));

module.exports = router;