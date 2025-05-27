
import mongoose from 'mongoose';

/*
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", ()=>{
    console.log("\nconnected to mongodb database!");
});

*/
const get_user_data = function(type, date, id){
    const dateObj = new Date(date);
    console.log(dateObj);

    const filter = {};
    //! define the different schemas into model and use mongoose API to 
    //! query models based on complex filters


}

get_user_data(0, "2025-05-06", 90909);

export default { get_user_data }