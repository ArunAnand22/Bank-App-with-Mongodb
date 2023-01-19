//import json webtoken
const jwt = require('jsonwebtoken');

//import db.js
const db=require('./db')

  //Register
  const register=(acno,username,password)=>{
    return db.User.findOne({acno}).then(//asynchoronous call
      user=>{
        if(user){
          return{
            status:false,
            statusCode:401,
            message:"User already registered"
          }
        }
        else{
          const newUser=new db.User({
            acno:acno,
            username:username,
            password:password,
            balance:0,
            transaction:[]
          })
          newUser.save()//to save new data to mongodb
          return{
            status:true,
            statusCode:200,
            message:"Register Successful in mongodb"
          }
        }
      }
    )

    if(acno in userDetails){
      return {
        status:false,
        statusCode:401,
        message:"User already exists"
      }
    }else{
      userDetails[acno]={
        acno:acno,
        username:username,
        password:password,
        balance:0,
        transaction:[]
      }
      return {
        status:true,
        statusCode:200,
        message:"Register successful"
      }
    }

  }

  //Login
  const login=(acno,password)=>{
    return db.User.findOne({acno,password}).then(
      user=>{
        if(user){
          currentUser=user.username
        currentAcno=user.acno
        //token generation
        const token=jwt.sign({ currentAcno:acno},'superkey2023')
        return {
            status:true,
            statusCode:200,
            message:"Login successful",
            token:token,
            currentUser:user.username,
            currentAcno:acno
        }
        }else{
          return {
            status:false,
            statusCode:401,
            message:"Invalid user details"
        }
        }
      }
    )
    if(acno in userDetails){
      if(pswd==userDetails[acno]['password']){
        currentUser=userDetails[acno]['username'];
        currentAcno=acno;
        //token generation
        const token=jwt.sign({ currentAcno:acno},'superkey2023')
        return {
            status:true,
            statusCode:200,
            message:"Login successful",
            token:token
        }
      }else{
        return {
            status:false,
            statusCode:401,
            message:"Invalid password"
        }
      }
    }else{
      return {
        status:false,
        statusCode:401,
        message:"Invalid user details"
      }
    }

  }

  //Deposit
  const deposit=(acno,password,amt)=>{
    var amount = parseInt(amt)
    return db.User.findOne({acno,password}).then(
      user=>{
        if(user){
          if(password==user.password){
            user.balance += amount;
            user.transaction.push({
              type:'Credit',
              amount
            })
            user.save(); 
            return {
              status:true,
              statusCode:200,
              message:`${amount} is credited and balance is ${user.balance}`
            }
          }else{
            return {
              status:false,
              statusCode:401,
              message:"Invalid password"
            }
          }
        }else{
          return {
            status:false,
            statusCode:401,
            message:"Invalid user details"
          }
        }
      }
    )
    var amount=parseInt(amt)
    if(acno in userDetails){
      if(pswd==userDetails[acno]['password']){
        userDetails[acno]['balance'] += amount;
        userDetails[acno]['transaction'].push({
          type:'Credit',
          amount
        })
        
        // return userDetails[acno]['balance'];
        return {
          status:true,
          statusCode:200,
          message:`${amount} is credited and balance is ${userDetails[acno]['balance']}`
        }
      }else{
        return {
          status:false,
          statusCode:401,
          message:"Invalid password"
        }
      }
    }else{
      return {
        status:false,
        statusCode:401,
        message:"Invalid user Id"
      }
    }
  }

  //withdraw
  const withdrawl=(acno,pswd,amt)=>{
    var amount=parseInt(amt)
    return db.User.findOne({acno,pswd}).then(
      user=>{
        if(user){
          if(pswd==user.password){
            if(amount<user.balance){
              user.balance -= amount;
              user.transaction.push({
                type:'Debit',
                amount
              })
              user.save();
            return {
              status:true,
              statusCode:200,
              message:`${amount} is debited and balance is ${user.balance}`
            }
            }else{
              return {
                status:false,
                statusCode:401,
                message:"Insufficient amount"
              }
            }
        }
        }else{
          return {
            status:false,
            statusCode:401,
            message:"Invalid password"
          }
        }
      }
    )
    if(acno in userDetails){
      if(pswd==userDetails[acno]['password']){
        if(amount<userDetails[acno]['balance']){
          userDetails[acno]['balance'] -= amount;
          userDetails[acno]['transaction'].push({
            type:'Debit',
            amount
          })
        return {
          status:true,
          statusCode:200,
          message:`${amount} is debited and balance is ${userDetails[acno]['balance']}`
        }
        }else{
          return {
            status:false,
            statusCode:401,
            message:"Insufficient amount"
          }
        }
      }else{
        return {
          status:false,
          statusCode:401,
          message:"Invalid password"
        }
      }
    }else{
      return {
        status:false,
        statusCode:401,
        message:"Invalid user Id"
      }
    }
  }
//Transactions
  const getTransaction=(acno)=>{
    return db.User.findOne({acno}).then(
      user=>{
        if(user){
          return {
            statusCode:200,
            transaction:user.transaction
          }
        }
      }
    )
    return {
      statusCode:200,
      transaction:userDetails[acno]['transaction']
    }
  }

  //Delete accounts
  const deleteAcc=(acno)=>{
    return db.User.findOneAndDelete({acno}).then(
      user=>{
        if(user){
          return{
            status:true,
            statusCode:200,
            message:"User deleted"
          }
        }else{
          return{
            status:false,
            statusCode:401,
            message:"User not found"
          }
        }
      }
    )
  }

//export
  module.exports={
    register,
    login,
    deposit,
    withdrawl,
    getTransaction,
    deleteAcc
  }