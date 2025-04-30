const orderModel = require('../../models/orderModel')

const getAllOrders = async(req, res)=>{

    try {
        const allOrders = await orderModel.find()

    res.json({
        message : "All Orders ",
        data : allOrders,
        success : true,
        error : false
    })
    } catch (error) {
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

module.exports = getAllOrders;