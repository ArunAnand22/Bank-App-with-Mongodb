//import express
const express=require('express')
//import JSONwebtoken
const jwt = require('jsonwebtoken');
//import cors
const cors=require('cors');

const dataService=require('./Services/dataService')
//create an app using express
const app=express()

app.use(express.json())

//give command to share via cors
app.use(cors({
    origin:['http://localhost:4200','http://192.168.137.1:8080']
}))
//create a portnumber
app.listen(3000,(req,res)=>{
    console.log('Register successful');
})
//Application specific middleware
const appMiddleware =(req,res,next)=>{
    console.log("Application specific middleware");
    next();
}
app.use(appMiddleware)

//Router specific middleWare
const jwtRouterMiddleware=(req,res,next)=>{
    try{
        console.log("Router specific middleware");
    const token=req.headers['x-access-token'];
    const data=jwt.verify(token,'superkey2023')
    console.log(data);
    next();
    }catch{
        //422 unprocessable entity
        res.status(422).json({
            statusCode:422,
            status:false,
            message:"Please login"
        })
    }
}
// Api calls--------------
//Register request
app.post('/register',(req,res)=>{
    dataService.register(req.body.acno,req.body.username,req.body.password).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
    
})
//Login
app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.password).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
    
})
//Deposit
app.post('/deposit',jwtRouterMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.password,req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
})
//Withdrawl
app.post('/withdrawl',jwtRouterMiddleware,(req,res)=>{
    dataService.withdrawl(req.body.acno,req.body.password,req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
    
})
//Transaction
app.post('/transaction',jwtRouterMiddleware,(req,res)=>{
    const result=dataService.getTransaction(req.body.acno).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )    
})
//Delete
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
})