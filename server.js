/*
Description: Microservice A server file for Xaviver's frontend main program. Endpoint to return 
            user data from a mongoDB database.
Author: Bryce Calhoun
*/

// imported tools
import express from 'express';
import User from './model.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware functions
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.post('/user-view', async(req, res)=>{
    /* 
    DESCRIPTION: A route handler defined to respond with relevant user data
                based on the date range specification.
    REQUEST: date range specifier(string), date (string), user id (string), OPTIONAL week of month (number)  
    RESPONSE: relevant classes and coursework for the student (JSON object of arrays)
    */
    const { type, date, user_id } = req.body;
    if(type && date && user_id){
        if(type == 'weekly' || type == 'daily' || type == 'monthly'){
            try{
                let data = undefined;
                if(type === 'daily'){
                    data = await User.get_daily_data(user_id, date);
                }
                else if(type == 'weekly'){
                    if(req.body.week){
                        data = await User.get_weekly_data(user_id, date, req.body.week);
                    }
                    else{
                        res.status(400).json({"Error": "Invalid Request"});
                        return;
                    }
                }
                else{
                    data = await User.get_monthly_data(user_id, date);
                }
                res.status(200).json(data);
                return;
            }catch(error){
                console.log(error);
                res.status(500).json({"Error": "Internal server error"});
                return;
            }
        }
    }
    res.status(400).json({"Error": "Invalid request"});
});


app.listen(PORT, ()=>{
    console.log("app listening on port: ", PORT);
});