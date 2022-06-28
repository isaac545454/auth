const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.get('/', (req, res)=>{
    res.status(200).json({msg: "bem vindo a nossa API"})
})
router.get('/user/:id', checkToken, async (req, res)=>{
    const id = req.params.id 
    const user = await User.findById(id, '-password')
    if(!user){
        return res.status(404).json({msg: "usuario não encontrado"})
    }
    res.status(200).json({ user })

})

function checkToken(req, res, next) {
    const authHeader= req.headers['aurhorization']
    const token = authHeader && authHeader.authHeader("")[1]
    if(!token){
        return res.status(401).json({msg: "acesso negado"})
    }
    try {
        const secret = process.env.SECRET
        jwt.veryfy(token, secret)
        
        next()
    } catch (error) {
        res.status(400).json(msg: "token invalido")
    }
}





//register
router.post('/auth/register', async (req, res) =>{
    const {name, email, password, confirmpassword} = req.body
    
    if(!name){
        return res.status(422).json({msg: "o nome é obrigatorio"})
    }
    if(!email){
        return res.status(422).json({msg: "o email é obridatorio"})
    }
    if(!password){
        return res.status(422).json({msg: "a senha é obrigatoria"})
    }
    if(!confirmpassword){
        return res.status(422).json({msg: "confirme a senha"})
    }
    if(password !== confirmpassword){
        return res.status(422).json({msg: "password e confirmpassword são diferentes"})
    }
    const userExists = await User.findOne({emaii: email})
    if(userExists){
        return res.status(200).json({msg: "por favor, utilize outro e-mail"})
    }
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save()
        res.status(201).json({msg: "usuario criado com sucesso"})
    } catch (error) {
        res.status(500).json({msg: error})

    }
    
})

router.post('/auth/login', async (req, res)=>{
    const {email, password} = req.body
    if(!email){
        return res.status(422).json({msg: "o email é obridatorio"})
    }
    if(!password){
        return res.status(422).json({msg: "a senha é obrigatoria"})
    }
    const user = await User.findOne({email: email})
    if(!user){
        return res.status(404).json({msg: "usuario ou senha incorreto"})
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
        return res.status(422).json({msg: " senha incorreto"})
    }

    try {
        const secret = process.env.SECRET
        const token =  jwt.sign(
            {
                id: user._id,
             },
             secret,
        )
        res.status(200).json({msg: "autenticação feita com sucessi", token})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "aconteceu um erro no servidor"})
    }


})
module.exports = router
