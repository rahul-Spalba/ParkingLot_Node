const { default: mongoose } = require("mongoose");
const { ParkingLot, ParkingStatus, SlotsBooked } = require("../schema");
const { createAndReturnSlots } = require("../utils");
// const objId = mongoose.Types.ObjectId;
const parkingLotsFilled = [
   { name:  'PL001',
    address: 'Sector-28 Gurgaon',
    rate:   [{twoWheeler:20,suv:60,hatchback:40,sedan:40 }],
    capacity:[{twoWheeler:100,suv:30,hatchback:50,sedan:50 }]
},
{ name:  'PL002',
address: 'Sector-24 Gurgaon',
rate:   [{twoWheeler:10,suv:50,hatchback:30,sedan:30 }],
capacity:[{twoWheeler:100,suv:30,hatchback:50,sedan:50 }]
},
{ name:  'PL003',
address: 'Udyog VIhar Gurgaon',
rate:   [{twoWheeler:40,suv:80,hatchback:60,sedan:60 }],
capacity:[{twoWheeler:300,suv:60,hatchback:100,sedan:100 }]
},
{
    name:'CompactParking',
    address:'Cannaught Place',
    rate:[{twoWheeler:50, suv:100, hatchback:70, sedan:70}],
    capacity:[{twoWheeler:10,suv:5,hatchback:5,sedan:5}]
}];


function run(){
mongoose.connect('mongodb://localhost:27017/parkingLotSystem',{
    useNewUrlParser:true, useUnifiedTopology:true})
    .then(async () => {
    let parking=await ParkingLot.insertMany(parkingLotsFilled);
    for (let i = 0; i < parking.length; i++) {
        let twoWheeler_slots = createAndReturnSlots('twoWheeler',parking[i].capacity[0].twoWheeler);
        let suv_slots = createAndReturnSlots('suv',parking[i].capacity[0].suv);
        let sedan_slots = createAndReturnSlots('sedan',parking[i].capacity[0].sedan);
        let hatchback_slots = createAndReturnSlots('hatchback',parking[i].capacity[0].hatchback);
        let data = {
            lot_id:parking[i]._id,
            twoWheeler:parking[i].capacity[0].twoWheeler, 
            suv:parking[i].capacity[0].suv, 
            sedan:parking[i].capacity[0].sedan, 
            hatchback:parking[i].capacity[0].hatchback,
            twoWheeler_slots: twoWheeler_slots,
            suv_slots:suv_slots,
            hatchback_slots:hatchback_slots,
            sedan_slots:sedan_slots
        }
        
        let slot = await SlotsBooked.create(data);
        console.info('parking id',parking[i]._id);
        console.info(slot);
        await ParkingLot.findByIdAndUpdate(parking[i]._id,{slot_id: slot._id});
    }
    
    if(parking){
        
    }
        await mongoose.disconnect();
        }).catch((err)=>{
      console.log('Error while connecting',err);
    });
}
run();
