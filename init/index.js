const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
main().then(res=>console.log("Connection Successful")).catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust1');
}
const initData=require("./data.js");
const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67bf1ee548e49a5bf9887978"}));
    await Listing.insertMany(initData.data).then(res=>console.log(res)).catch(err=>console.log(err));
    console.log("Data is listed");
}
initDb();
