//server-mongodb integration

//import mongoose
const mongoose=require('mongoose')
//State connection string via mongoose
mongoose.connect("mongodb://127.0.0.1:27017/users",{
    useNewUrlParser:true, //avoid unwanted warnings
    useUnifiedTopology:true
})

//Define bank model
const User=mongoose.model('User',{ //model creation

    //schema creation
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]

})

module.exports={
    User
}