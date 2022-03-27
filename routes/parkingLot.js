const express  = require('express');
const router = express.Router({mergeParams:true});

const ParkingLotController = require('../controllers/ParkingLotController');

router.get('/getAllParkingLot', ParkingLotController.getAllParkingLayout);
// id used from parkinglots collection
router.get('/getParkingLotById/:id', ParkingLotController.getParkingById);
router.delete('/deleteById/:id', ParkingLotController.deleteParkingById);
router.patch('/updateParkingLotById/:id', ParkingLotController.updateParkingById);
router.post('/createNewParkingLot', ParkingLotController.createNewParkingLot);
module.exports = router;