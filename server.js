/*
Description: Microservice for Xaviver's frontend main program. Endpoints to return 
            user data from a mongoDB database.
Author: Bryce Calhoun
*/


import express from 'express';
import User from './model.js';
const app = express();
const PORT = 3000;


app.use(express.json());

//? what are the endpoints that I need to build?
//todo 1 request for daily, weekly, or monthly class data


app.get('/user-view', (req, res)=>{
    const { type, date, id } = req.body;
    if(type == 'weekly' || type == 'daily' || type == 'monthly'){
        try{
            User.get_user_data(type, date, id);

        }catch(error){
            console.log(error);
            res.status(500).json({"Error": "Internal server error"});
        }
    }
    else{
        res.status(400).json({"Error": "Bad request"});
    }
    


});


app.listen(()=>{
    console.log("app listening on port: ", PORT);
});