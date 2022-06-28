//YonYPMzHsWVTn0kD
//mongodb+srv://isaac:<password>@cluster0.hjhia.mongodb.net/?retryWrites=true&w=majority
require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const rotas = require('./router/routerUser')
const app = express()

app.use(express.json())
app.use('/', rotas)





const dbuser = process.env.DB_USER
const dbpass = process.env.DB_PASS

mongoose.connect(
    `mongodb+srv://${dbuser}:${dbpass}@cluster0.hjhia.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(3000, ()=>{console.log("rodando")})
}).catch((err)=>console.log(err))