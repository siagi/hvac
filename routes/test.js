const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order')
const { getLatestEmails } = require('../google/getLastestEmails');
const {sendGmailEmail} = require('../google/sendEmail')
const Customer = require('../models/Customer');
// const {verifyToken} = require('../middleware/verifyToken')

/*
WORKFLOW:
1.
2.
3.
4.
5.

*/

router.get('/test', async (req,res) =>{
    const emails = []
    const addEmail = (item) => {
       emails.push(item);
       console.log('adding...')
    }
    const checkTheEmail = async () => {
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>console.log("DB connection Successfull"))
        .catch((error)=>console.log(error));
        for(let i=0; i<emails.length; i++){
            const {from, subject, text} = emails[i];
            let customer = await Customer.findOne({email:from});
            if(!customer){
                const newCustomer = new Customer({
                    email:from
                })
                const customer = await newCustomer.save();
                console.log(customer)
            }

            const newOrder = new Order({
                customer:customer._id,
                description:text,
                title:subject
            })
            const savedOrder = await newOrder.save();
            console.log(savedOrder);
            sendGmailEmail(from)
            
        }
        await mongoose.disconnect();
    }
    getLatestEmails(addEmail, checkTheEmail);

    //     console.log(emails)
    // }, 5000)
    // console.log('DATA',req.data);
    // console.log('asdf')
    // await sendGmailEmail();
   
    // const o = await Order.findById('61e1aff70af1be59793b6715');
    // console.log('O',o);
    // await mongoose.disconnect();


    res.status(200).json({mail:'confirmed'});
})


module.exports = router