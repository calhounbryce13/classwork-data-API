/*
Description: Microservice A model file for Xaviver's frontend main program. Endpoint to return 
            user data from a mongoDB database.
Author: Bryce Calhoun
*/

// imported tools
import mongoose from 'mongoose';

// configuring connection to mongoDB database
mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

// connecting to mongoDB database
db.once("open", ()=>{
    console.log("\nconnected to mongodb database!");
});

/////////////////////////////////////////////////////////////////////////////////////////////

const task = new mongoose.Schema({
    title: String,
    description: String,
    due_date: String,
    due_time: String,
    week: String
});

const event = new mongoose.Schema({
    title: String,
    location: String,
    date: String,
    start_time: String,
    end_time: String,
    week: String
});

const classSchema = new mongoose.Schema({
    title: String,
    location: String,
    room: String,
    class_date: String,
    start_time: String,
    end_time: String,
    week: String
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    created_at: String,
    classes: [classSchema],
    events: [event],
    tasks: [task]
});

const userModel = mongoose.model('user', userSchema, 'microservice_A');


/////////////////////////////////////////////////////////////////////////////////////////////

const extract_month = function(dateString){
    /* 
    DESCRIPTION: Function to take a string representing a given date in format 
                DD-MM-YY or DD-MM-YYYY. Month must be in the middle.
    INPUT(S): Date (string)
    OUTPUT(S): Month (string)
    */
    let month = '';
    let isMonth = false;
    for(let i = 0; i < dateString.length; i++){
        if(dateString[i] == '-' && (!isMonth)){
            isMonth = true;
            continue;
        }
        if(isMonth){
            if(dateString[i] == '-'){
                return month;
            }
            else{
                month += dateString[i];
            }
        }
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////
const get_daily_data = async(id, date)=>{
    /* 
    DESCRIPTION:
    INPUT(S):
    OUTPUT(S):
    */
    const myUser = await userModel.findById(id);
    if(myUser){
        const returnObject = {
            classes: [],
            events: [],
            tasks: []
        };

        for(let i = 0; i < (myUser.classes).length; i++){
            if(myUser.classes[i].class_date == date){
                (returnObject.classes).push(myUser.classes[i]);
            }
        }

        for(let i = 0; i < (myUser.events).length; i++){
            if(myUser.events[i].date == date){
                (returnObject.events).push(myUser.events[i]);
            }
        }

        for(let i = 0; i < (myUser.tasks).length; i++){
            if(myUser.tasks[i].due_date == date){
                (returnObject.tasks).push(myUser.tasks[i]);
            }
        }
        return returnObject;
    }
    return null;
}

const get_monthly_data = async(id, date)=>{
        /* 
    DESCRIPTION:
    INPUT(S):
    OUTPUT(S):
    */
    const myUser = await userModel.findById(id);
    if(myUser){
        const returnObject = {
            classes: [],
            events: [],
            tasks: []
        };
        for(let i = 0; i < (myUser.classes).length; i++){
            const givenDate = myUser.classes[i].class_date;
            if(extract_month(givenDate) == extract_month(date)){
                returnObject.classes.push(myUser.classes[i]);
            }
        }
        for(let i = 0; i < (myUser.events).length; i++){
            const givenDate = myUser.events[i].date;
            if(extract_month(givenDate) == extract_month(date)){
                returnObject.events.push(myUser.events[i]);
            }
            
        }
        for(let i = 0; i < (myUser.tasks).length; i++){
            const givenDate = myUser.tasks[i].due_date;
            if(extract_month(givenDate) == extract_month(date)){
                returnObject.tasks.push(myUser.tasks[i]);
            }
        }
        return returnObject;
    }
    return null;
}

const get_weekly_data = async(id, date, week)=>{
    /* 
    DESCRIPTION:
    INPUT(S):
    OUTPUT(S):
    */
    const myUser = await userModel.findById(id);
    if(myUser){
        const returnObject = {
            classes: [],
            events: [],
            tasks: []
        };
        for(let i = 0; i < (myUser.classes).length; i++){
            const givenDate = myUser.classes[i].class_date;
            if((extract_month(givenDate) == extract_month(date)) && (week == myUser.classes[i].week)){
                returnObject.classes.push(myUser.classes[i]);
            }
        }
        for(let i = 0; i < (myUser.events).length; i++){
            const givenDate = myUser.events[i].date;
            if((extract_month(givenDate) == extract_month(date)) && (week == myUser.events[i].week)){
                returnObject.events.push(myUser.events[i]);
            }
            
        }
        for(let i = 0; i < (myUser.tasks).length; i++){
            const givenDate = myUser.tasks[i].due_date;
            if((extract_month(givenDate) == extract_month(date)) && (week == myUser.tasks[i].week)){
                returnObject.tasks.push(myUser.tasks[i]);
            }
        }
        return returnObject;
    }
    return null;
}


/////////////////////////////////////////////////////////////////////////////////////////////

export default { get_daily_data, get_monthly_data, get_weekly_data }

