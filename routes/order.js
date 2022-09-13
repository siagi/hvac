
// const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

const checkAvailableDate = async () => {
    try {
        const GMT = 0
        const today = new Date(Date.now());
        const generateDataDays = () => {
            today.getDay() === 5 ? today.setDate(today.getDate() + 3) : today.setDate(today.getDate() + 1)
            const am = new Date(today.setHours(8+GMT,0,0,0))
            const pm = new Date(today.setHours(12+GMT,0,0,0))
            return[am, pm]
        }

        let days = {
            days:[],
            availableDays:[],
        }
        
        for (let i = 0 ; i<=5; i++) {
            const [am, pm] = generateDataDays();
            days.days = [...days.days,am,pm];
        }
        console.log(days.days);
        await mongoose.connect(process.env.MONGO_URL);

        for (let i = 0; i<days.days.length; i++){

            const isOrder = await Order.findOne({serviceDate:days.days[i]}).exec()
            if(!isOrder){
                days.availableDays.push(days.days[i]);
            }

        }

        console.log('check days',days.availableDays);
        return days.availableDays

    } catch (error) {
        console.log(error)
    }

}

const getOrderByMonth = async() => {
    await mongoose.connect(process.env.MONGO_URL);
    // const orders = await Order.find({'$where' : function() { return this.serviceDate.getMonth() == 9 }})
    const orders = await Order.where('serviceDate').gte(new Date('2022-09-01')).lte(new Date('2022-10-01'));
    console.log('Orders 09:',orders)
    await mongoose.disconnect();
    return orders;
}

// router.get('/availableOrderDate',async(req,res)=>{
//     try {
//         const GMT = 0
//         const today = new Date(Date.now());
//         const generateDataDays = () => {
//             today.getDay() === 5 ? today.setDate(today.getDate() + 3) : today.setDate(today.getDate() + 1)
//             const am = new Date(today.setHours(8+GMT,0,0,0))
//             const pm = new Date(today.setHours(12+GMT,0,0,0))
//             return[am, pm]
//         }

//         let days = {
//             days:[],
//             availableDays:[],
//         }
        
//         for (let i = 0 ; i<=5; i++) {
//             const [am, pm] = generateDataDays();
//             days.days = [...days.days,am,pm];
//         }
//         console.log(days.days);
//         await mongoose.connect(process.env.MONGO_URL);

//         for (let i = 0; i<days.days.length; i++){

//             const isOrder = await Order.findOne({serviceDate:days.days[i]}).exec()
//             if(!isOrder){
//                 days.availableDays.push(days.days[i]);
//             }

//         }

//         console.log('check days',days.availableDays);
//         // let checkDays
        
       
//         // today.setDate(today.getDate() + 1)
//         // const day_2_am = new Date(today.setHours(9+GMT,0,0,0));
//         // const day_2_pm = new Date(today.setHours(13+GMT,0,0,0))
//         // today.setDate(today.getDate() + 1)
//         // const day_3_am = new Date(today.setHours(9+GMT,0,0,0));
//         // const day_3_pm = new Date(today.setHours(13+GMT,0,0,0))
//         // console.log(day_1_am, day_1_pm, day_2_am, day_2_pm, day_3_am, day_3_pm, day_4_am, day_4_pm, day_5_am, day_5_pm)
//         // await mongoose.connect(process.env.MONGO_URL);
//         // const findOrder = await Order.find({"created_on":{"$lte":new Date(Date.now())}})
//         // console.log(findOrder)
//         res.send(200).end();

//     } catch (error) {
//         // console.log(error)
//         res.status(500).json(error);
//     }
// })

module.exports = {checkAvailableDate, getOrderByMonth}