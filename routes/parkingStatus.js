const express  = require('express');
const router = express.Router({mergeParams:true});

const ParkingStatusController = require('../controllers/ParkingStatusController');
// id used from ParkingLot model
router.get('/getStatusByParkingLot/:id',ParkingStatusController.getParkingLotStatus);
router.post('/parkVehicle/:id', ParkingStatusController.parkAVehicle);
router.post('/generateBill/:id', ParkingStatusController.generateBill);
//parked vehicle registration number from ParkingStatus
router.get('/getParkingHistory/:registration_nu', ParkingStatusController.vehicleParkingHistory);
module.exports = router;