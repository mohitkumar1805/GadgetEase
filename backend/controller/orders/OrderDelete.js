const orderModel = require("../../models/orderModel")


const orderDelete = async(req, res)=>{
try {
    const orderId = await req.body._id
    const deleteOrder = await orderModel.deleteOne({_id :orderId})
    res.json({
        message : "Order Deleted",
        error : false,
        success : true,
        data : deleteOrder
    })
} catch (error) {
    res.json({
        message : err?.message || err,
        error : true,
        success : false
    })
}    
}

module.exports = orderDelete