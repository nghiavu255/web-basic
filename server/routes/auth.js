require('dotenv').config()
const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')
// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password')
		if (!user)
			return res.status(400).json({ success: false, message: 'User not found' })
		res.json({ success: true, user })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


//@route POST api/auth/register
//@desc Register user
//@access public
router.post('/register', async(req,res) =>{
    const {username,password,role} = req.body

    //Simple validation
    if(!username || !password)
        return res.status(400).json({success:false, message:'Missing user name or password'})
    else{
        try {
            // check for existing user
            const user = await User.findOne({username})
    
            if(user)
                return res.status(400).json({success:false, message:'Username ==='})
    
            // hash password use agon2
            const hashedPassword = await argon2.hash(password)
            const newUser = new User({username , password: hashedPassword , role: role||'khachHang'})
            await newUser.save()
    
            //return token use jsonwebtoken
            const accessToken = jwt.sign({userId: newUser._id},process.env.ACCESS_TOKEN)
            console.log(accessToken)
            return res.json({success:true, message:'user created successfully',accessToken})
        
        } catch (error) {
            console.log(error)
            res.status(500).json({success:false, message:'error'})
        }
    }
})

//@route POST api/auth/login
//@desc Login user
//@access public

router.post('/login', async(req, res) =>{
    const {username, password} = req.body

    if(!username || !password)
        return res.status(400).json({success:false, message:"Chưa nhập tài khoản hoặc mật khẩu!!!!"})
    try {
        const user = await User.findOne({username})
        if(!user)
            return res.status(400).json({success:false,message:'Tài khoản hoặc mật khẩu không chính xác'})
        //Username Found user argon2
        const passwordValid = await argon2.verify(user.password,password)
        if(!passwordValid)
            return res.status(400).json({success:false,message:'Tài khoản hoặc mật khẩu không chính xác'})
        const accessToken = jwt.sign({userId: user._id},process.env.ACCESS_TOKEN)
        console.log(accessToken)
        return res.json({success:true, message:'user login successfully',accessToken})
    } catch (error) {
        console.log(error)
            res.status(500).json({success:false, message:'error'})
    }
})
module.exports = router