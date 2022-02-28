var express = require('express');
var router = express.Router();
var { MongoClient, ObjectId } = require('mongodb');
const connection = require('../dbConnection.js');
var urlencodedParser = express.urlencoded({ extended: false });
var multer = require('multer');
// var session_check = require("../../Constant/candidateSession.js");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });


router.post('/registerUser', urlencodedParser, upload.single('profile'), async function (req, res) {

    try {

        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);


        var profileimg = req.file.filename;
        var name = req.body.name
        var email = req.body.email
        var mobile = req.body.mobile
        var password = req.body.password



        var checkMobileNumberExist = await db.collection('mainUser').find({ 'mobile': mobile }).toArray();
        if (checkMobileNumberExist.length > 0) {
            res.send({ status: false, message: "user already exist", data: [] })
        }
        else {
            var checkemailIdExist = await db.collection('mainUser').find({ 'email': email }).toArray();
            if (checkemailIdExist.length > 0) {
                res.send({ status: false, message: "Email ID already exist try with another", data: [] })
            }
            else {

                await db.collection('mainUser').insertOne({
                    profileimg: './public/' + profileimg,
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: password,
                });

                await client.close();
                res.send({ status: true, message: "user Register Successfully", data: [] })

            }
        }

    }
    catch (e) {
        res.send({ status: false, message: "Error in Api", data: [e.stack] })
    }
});



router.post('/login', urlencodedParser, async function (req, res) {
    try {
        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);

        var mailid = req.body.mailID;
        var password = req.body.password;
        var fatchEmployee

        var row = await db.collection('mainUser').find({ 'email': mailid, 'password': password }).toArray();
        if (row.length > 0) {

            fatchEmployee = await db.collection('mainUser').aggregate([
                {
                    $match:
                    {
                        "email": mailid,
                        "password": password,
                    }
                },
                {
                    $project:
                    {
                        _id: 1,
                    }
                }

            ]).toArray();

            res.send({ status: true, message: "Logged In", data: fatchEmployee })
        }
        else {
            res.send({ status: false, message: "User not present", data: [] })
        }

        await client.close();
    }
    catch (e) {
        res.send({ status: false, message: "err", data: e.stack })
    }
});


router.post('/resetPassword', urlencodedParser, async function (req, res) {
    try {
        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);

        var mailid = req.body.mailID;
        var fatchEmployee

        var row = await db.collection('mainUser').find({ 'email': mailid }).toArray();
        if (row.length > 0) {

            fatchEmployee = await db.collection('mainUser').aggregate([
                {
                    $match:
                    {
                        "email": mailid,
                    }
                },
                {
                    $project:
                    {
                        _id: 1,
                        email: 1,
                        password: 1
                    }
                }

            ]).toArray();
            console.log(fatchEmployee)

            res.send({ status: true, message: "Your Password", data: fatchEmployee })
        }
        else {
            res.send({ status: false, message: "User not present", data: [] })
        }

        await client.close();
    }
    catch (e) {
        res.send({ status: false, message: "err", data: e.stack })
    }
});

router.post('/addUser', urlencodedParser, upload.single('Profile'), async function (req, res) {
    try {
        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);
        console.log(req.body)

        var Profile =req.file.filename;
        var Full_Name = req.body.Full_Name;
        var Mobile = req.body.Mobile;
        var Email = req.body.Email;
        var Address = req.body.Address;
        var Country = req.body.Country;
        var State = req.body.State;
        var City = req.body.City;
        var Pincode = req.body.Pincode;

        var user = await db.collection('users').insertOne({
            profileimg: Profile,
            Full_Name: Full_Name,
            Mobile: Mobile,
            Email: Email,
            Address: Address,
            Country: Country,
            State: State,
            City: City,
            Pincode: Pincode,
        });
        res.send({ status: true, message: "User Added Successfully", data: user })
        await client.close();
    }
    catch (e) {
        res.send({ status: false, message: "err", data: e.stack })
    }
});


router.post('/updateUser', urlencodedParser, async function (req, res) {
    try {
        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);
        var updatebody = {};
        updatebody['Profile'] = req.body.Profile;
        updatebody['Full_Name'] = req.body.Full_Name;
        updatebody['Mobile'] = req.body.Mobile;
        updatebody['Email'] = req.body.Email;
        updatebody['Address'] = req.body.Address;
        updatebody['Country'] = req.body.Country;
        updatebody['State'] = req.body.State;
        updatebody['City'] = req.body.City;
        updatebody['Pincode'] = req.body.Pincode;
        var updateUserSet = { $set: updatebody };
        var updateUserId = { _id: ObjectId(req.body.id) };
        await db.collection('users').updateOne(updateUserId, updateUserSet);
        res.send({ status: true, message: "User updated Successfully", data: [] })
        await client.close();
    }
    catch (e) {
        res.send({ status: false, message: "err", data: e.stack })
    }
});

router.post('/deleteUser', urlencodedParser, async function (req, res) {
    try {

        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);
        await db.collection('users').deleteOne({ '_id': ObjectId(req.body.id) });
        await client.close();
        res.send({ status: true, message: "User deleted Successfully", data: [] })
    }
    catch (err) {
        console.log(err.stack);
    }

});

router.get('/getAlluser', urlencodedParser, async function (req, res) {
    try {
        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);
        var row = await db.collection('users').find().toArray();
        res.send({ status: true, message: "Users fetched Successfully", data: row })
    }
    catch (e) {
        res.send({ status: false, message: "User not added", data: [] })
    }
});
router.post('/getSpecificUser', urlencodedParser, async function (req, res) {
    try {
        const client = new MongoClient(connection.url);
        await client.connect();
        const db = client.db(connection.name);
        var id = req.body.id
        var row = await db.collection('users').find({ '_id': ObjectId(id) }).toArray();

        res.send({ status: true, message: "User fetched Successfully", data: row })
    }
    catch (e) {
        res.send({ status: false, message: "User not added", data: [] })
    }
});

router.get('/logout', urlencodedParser, async function (req, res) {
    try {
       
        res.send({ status: true, message: "User LoggedOut Successfully", data: row })
    }
    catch (e) {
        res.send({ status: false, message: "User not added", data: [] })
    }
});

module.exports = router;