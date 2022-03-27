const { ParkingLot } = require("../schema")
const mongoose = require('mongoose');
const objId = mongoose.Types.ObjectId;
module.exports = {
    getAllParkingLayout : async (req, res) =>{
        try {
            let allParkingLots = await ParkingLot.find();
            res.json({success:true, data: allParkingLots});    
        } catch (error) {
            res.json({success:false, msg:error});
            console.error(error);
        }        
    },
    getParkingById : async (req, res) =>{
        const parkingLotId = objId(req.params.id);
        try {
            let parkingLot = await ParkingLot.findById(parkingLotId);
            res.json({success:true, data: parkingLot});
        } catch (error) {
            res.json({success:false, msg:error});
            console.error(error);
        }
    },
    deleteParkingById: async (req, res) =>{
        const parkingLotId = objId(req.params.id);
        try {
            let parkingLotDeleted = await ParkingLot.findByIdAndDelete(parkingLotId);
            res.json({success:true})
        } catch (error) {
            res.json({success:false, msg:error})
            
        }
    },
    updateParkingById:async (req, res) =>{
        const parkingLot = req.params.id;
        const updateBody = req.body;
        try {
            await ParkingLot.findByIdAndUpdate(parkingLot,updateBody);
            const isUpdated = await ParkingLot.findOne({name:'RahulParking'});
            res.json({data:isUpdated, success:true, msg:'Updated Successfully!!'})

        } catch (error) {
            console.error(error);
        }
    },
    createNewParkingLot:async(req, res) =>{
        let parkingLot = await ParkingLot.create(req.body);
        let twoWheeler_slots = createAndReturnSlots('twoWheeler',parkingLot.capacity[0].twoWheeler);
        let suv_slots = createAndReturnSlots('suv',parkingLot.capacity[0].suv);
        let sedan_slots = createAndReturnSlots('sedan',parkingLot.capacity[0].sedan);
        let hatchback_slots = createAndReturnSlots('hatchback',parkingLot.capacity[0].hatchback);
        let data = {
            lot_id:parkingLot._id,
            twoWheeler:parkingLot.capacity[0].twoWheeler, 
            suv:parkingLot.capacity[0].suv, 
            sedan:parkingLot.capacity[0].sedan, 
            hatchback:parkingLot.capacity[0].hatchback,
            twoWheeler_slots: twoWheeler_slots,
            suv_slots:suv_slots,
            hatchback_slots:hatchback_slots,
            sedan_slots:sedan_slots
        }
        const slot = await SlotsBooked.create(data);
        const parkingCreated=await ParkingLot.findByIdAndUpdate(parkingLot._id,{slot_id: slot._id});
        res.json({msg:'Created Successfully!',data:[parkingCreated,slot]})
    }
}