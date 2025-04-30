
const addToCartModel = require("../../models/cartProduct");
const Order = require("../../models/orderModel");

const clearCart = async (req, res) => {
    try {
        const currentUser = req.userId;
        
        // Fetch cart items
        const cartItems = await addToCartModel.find({ userId: currentUser }).populate("productId");

        if (!cartItems || cartItems.length === 0) {
            return res.json({ success: false, error: true, message: "No products found in the cart" });
        }

        // Prepare order data
        const orderProducts = cartItems.map(item => ({
            productId: item.productId._id,
            productName: item.productId.productName,
            productImage: item.productId.productImage[0],
            quantity: item.quantity,
            price: item.productId.sellingPrice
        }));

        const totalAmount = orderProducts.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Save order to database
        const order = new Order({
            userId: currentUser,
            products: orderProducts,
            totalAmount,
            status: 'Completed'
        });
        await order.save();

        // Clear the user's cart
        await addToCartModel.deleteMany({ userId: currentUser });

        res.json({
            success: true,
            error: false,
            message: "Cart cleared and order saved successfully"
        });
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = clearCart;