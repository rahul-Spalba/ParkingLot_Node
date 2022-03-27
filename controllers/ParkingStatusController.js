const { ParkingLot,ParkingStatus, SlotsBooked } = require("../schema")
const moment = require("moment");
const { createBill } = require("../utils");


module.exports = {
    getParkingLotStatus : async (req, res) =>{
        const parkingLotId = req.params.id;
        let parkingLotInfo = await ParkingStatus.find({lot_id:parkingLotId});
        console.info(parkingLotInfo);
        res.json({data:parkingLotInfo});
    },

    parkAVehicle : async (req, res) =>{
        let lot_id= req.params.id;
        let type = req.body.type;
        let registration_nu = req.body.vehichle_Registration_nu;
        
        //checks if vehicle is parked currently with is_parked
        const isAlreadyParked = await ParkingStatus.exists({vehichle_Registration_nu:registration_nu,is_parked:true});

        if(isAlreadyParked) return res.json({msg:"Car already parked"});
        
        //slots for each parking lot describing the current available position for each category
        const slots = await SlotsBooked.find({lot_id:lot_id});
        console.info("Slots are", slots);
        const remaining = slots[0];
        let category_slots = `${type}_slots`;
        console.info('remainig type',remaining[type]);
        //if selected vehicle category has empty space than Park
        if(remaining[type]>0){
            console.info('slots ', remaining[category_slots]);
           
            let index = remaining[category_slots].findIndex(x => x.isOccupied === false);
            let updateItem = remaining[category_slots];
            console.info('index',index)

            updateItem[index].isOccupied = true;
            console.info("Update item",updateItem[index].isOccupied);
 
            remaining[type]--;
            console.info('update remaining after size decreased',remaining);
            const update = await SlotsBooked.updateOne({lot_id:lot_id}, remaining,{upsert:true});
            let data = {
                lot_id: lot_id,
                lot_position:updateItem[index].slot,
                is_parked:updateItem[index].isOccupied,
                vehichle_Registration_nu:registration_nu,
                type:type
            }
            console.info('data while insert',data);
            let parkingStatus = await ParkingStatus.create(data);
            return res.json({msg:"Parked Successfully", data:parkingStatus});
        }else{
            if(isNaN(remaining[type])){
                return res.json({msg:`${type} is not available for parking`})
            }
            return res.json({msg:"Parking lot full"})
        }
        
    },
    generateBill: async(req, res) =>{
        let lot_id= req.params.id;
        let registration_nu = req.body.vehichle_Registration_nu;
        
        const isAlreadyParked = await ParkingStatus.exists({vehichle_Registration_nu:registration_nu,is_parked:true});
        if(isAlreadyParked){
           let  fetch_vehicle_status = await ParkingStatus.findOne({vehichle_Registration_nu:registration_nu});
           const type = fetch_vehicle_status.type;
           let parkingLotPrice = await ParkingLot.findOne({_id:lot_id}, 'rate -_id');
            const currentHourlyPrice = parkingLotPrice.rate[0];
           let parkedAt= moment(fetch_vehicle_status.createdAt);
            let now = moment();
            let timeElapsed = now.diff(parkedAt,'seconds');
            console.info("time now", now, "parked-at", parkedAt)
            const amountGenerated = createBill(timeElapsed, currentHourlyPrice[type])
            console.info('amout generated',amountGenerated);
            var format =  Math.floor(moment.duration(timeElapsed,'seconds').asHours()) + ':' + moment.duration(timeElapsed,'seconds').minutes() + ':' + moment.duration(timeElapsed,'seconds').seconds();
            console.info('time elapsed', format, amountGenerated," Rs");
            let updateData = {
                is_parked:false,
                bill_amount:amountGenerated,
                duration:format,
            }
            let SlotData = await SlotsBooked.findOne({lot_id:lot_id});
            const category_slots = `${type}_slots`;
            const index = SlotData[category_slots].findIndex(x => x.slot === fetch_vehicle_status.lot_position);
            let update = SlotData[category_slots];
            update[index].isOccupied = false; 
            SlotData[type]++;
            let update_slots=await SlotsBooked.updateOne({lot_id:lot_id}, SlotData,{upsert:true});
            console.info("slot data",update_slots);
            const unparked=await ParkingStatus.findByIdAndUpdate(fetch_vehicle_status._id, updateData, {upsert:true});

           const responseData = {
               slot:fetch_vehicle_status.lot_position,
               amout:amountGenerated,
               duration:format,
               registration_nu: unparked.vehichle_Registration_nu,
           }
            return res.json({msg: "Bill generated Succefully. Thankyou !!", data:responseData})
        }

    },
    vehicleParkingHistory: async(req, res)=>{
        const registration_nu = req.params.registration_nu;
        let hasHistory =ParkingStatus.exists({vehichle_Registration_nu:registration_nu});
        if(hasHistory){
            let history = await ParkingStatus.find({vehichle_Registration_nu:registration_nu},'updatedAt vehichle_Registration_nu lot_position type bill_amount is_parked')
            res.json({msg:'History Generated Successfully!',data:history})
        }
    } 
}

