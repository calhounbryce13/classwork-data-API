
import mongoose from 'mongoose';


mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

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

const create_new_user = async(email, password, created_at, classes, events, tasks)=>{
    const newUser = new userModel({email: email, password:password, created_at: created_at, classes: classes, events: events, tasks: tasks});

    return await newUser.save();
}



/////////////////////////////////////////////////////////////////////////////////////////////
const get_daily_data = async(id, date)=>{
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




