
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

app.use(express.json());//parses json req body
//default Route for app
app.get('/', (req, res) => {
  res.send('Parking Lot System is Online')
})

//specific routes for structured routing of various apis
app.use("/parkingLot", require("./routes/parkingLot"));
app.use("/parkingStatus", require("./routes/parkingStatus"));
//Listening to server on port 3000 
app.listen(port, () => {
  console.log(`Parking Lot Server listening on port ${port}`)
})

main().catch(err => console.log(err));
async function main() {
  //conncetion is made visible here for the assignment , 
  //But never expose this connection configuration in code
  await mongoose.connect('mongodb://localhost:27017/parkingLotSystem',{
    useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => {console.log("Db listening")}).catch((err)=>{
      console.log('Error while connecting',err);
    });
  };


