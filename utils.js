
const createAndReturnSlots= function (type, capacity){
        let prefix_Char = '';
        if(type == 'twoWheeler'){
            prefix_Char = "B_"
        }
        if(type == 'suv'){
            prefix_Char = "S_"
        }
        if(type == 'sedan'){
            prefix_Char = "SED_"
        }
        if(type == 'hatchback'){
            prefix_Char = "HB_"
        }
        let allSLots = new Array();
        for(let i=0; i<capacity; i++){
            
            let slot = `${prefix_Char}${i+1}`;
            let booked = false;
            let obj = {
                slot :slot,
                isOccupied:booked
            }
            allSLots.push(obj);
        }
        return allSLots;
}
const createBill = function(time, price){
    if(time<=3600){
        return price;
    }else{
        let amount = (Math.ceil((time/3600).toFixed(1)) * price)
        return amount
    }
}
module.exports={createBill, createAndReturnSlots}
