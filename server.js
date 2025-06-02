/*
Description: Microservice A for Xaviver's frontend main program. Endpoint to return 
            user data from a mongoDB database.
Author: Bryce Calhoun
*/


import express from 'express';
import User from './model.mjs';
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.post('/user-view', async(req, res)=>{
    const { type, date, user_id } = req.body;
    if(type && date && user_id){
        if(type == 'weekly' || type == 'daily' || type == 'monthly'){
            try{
                if(type === 'daily'){
                    const data = await User.get_daily_data(user_id, date);
                    res.status(200).json(data);
                    console.log("wnefiown");
                    return;
                }
                else if(type == 'weekly'){
                    if(!(req.body.week)){
                        res.status(400).json({"Error": "Bad Request"});
                        return;
                    }
                    const data = await User.get_weekly_data(user_id, date, req.body.week);
                    res.status(200).json(data);
                    return;
                }
                else{
                    const data = await User.get_monthly_data(user_id, date);
                    res.status(200).json(data);
                    return;
                }
            }catch(error){
                console.log(error);
                res.status(500).json({"Error": "Internal server error"});
                return;
            }
        }
    }
    res.status(400).json({"Error": "Bad request"});
});


app.listen(PORT, ()=>{
    console.log("app listening on port: ", PORT);
});