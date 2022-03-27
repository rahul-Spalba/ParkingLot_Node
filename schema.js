const mongoose = require('mongoose');
const { Schema } = mongoose;

const parkinLot = new Schema({
  name:  String, // String is shorthand for {type: String}
  address: String,
  rate:   Array,
  capacity:Array, 
  slot_id:{type:mongoose.Schema.Types.ObjectId, ref:'booked'}

});
const slotsBooked = new Schema({
  lot_id:{type: mongoose.Schema.Types.ObjectId, ref:'parkingLot'},
  twoWheeler:Number, 
  suv:Number, 
  sedan:Number, 
  hatchback:Number,
  twoWheeler_slots:Array,
  suv_slots:Array,
  hatchback_slots:Array,
  sedan_slots:Array,
})

const parkingStatus = new Schema({
   lot_id: {type: mongoose.Schema.Types.ObjectId, ref:'parkingLot'},
   lot_position:  String,
   is_parked:Boolean,
   vehichle_Registration_nu: String,
   bill_amount:Number,
   type:String,

},{timestamps:true});

const ParkingLot = mongoose.model('parkingLot', parkinLot);
const ParkingStatus = mongoose.model('parkingStatus', parkingStatus);
const SlotsBooked = mongoose.model('booked', slotsBooked);

module.exports = {ParkingLot, ParkingStatus,SlotsBooked}; 