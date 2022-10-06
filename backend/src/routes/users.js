const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt')

//register
router.post("/register", async (req, res)=>{
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newuser = new User({
            username: req.body.username,
            email: req.body.email,
            password:hashPassword
        })

        // save user and send response
        const user = await newuser.save();
        res.status(200).json(user._id);

    } catch (error) {
        res.status(500).json(err)
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        // find user
        const user = await User.findOne({username:req.body.username});
        if (!user) {
            res.status(404).json("Incorrect Username or Password!");
        }

        // validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).json("Incorrect Username or Password!");

        // send res
        res.status(200).json({_id : user._id, username: user.username})
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router