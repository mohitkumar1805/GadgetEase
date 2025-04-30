const orderModel = require('../../models/orderModel')

const userOrder = async(req, res)=>{
    try {
        const currentUser = req.userId;
        const userData = await orderModel.find({userId: currentUser});
        console.log("isProductAvailabl   ",currentUser)
        if (!userData || userData.length === 0) {
            return res.json({ success: false, error: true, message: "No products found in the cart" });
        }

        res.json({
            message : "User Orders ",
            data : userData,
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


module.exports = userOrder;