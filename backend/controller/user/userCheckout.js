const addToCartModel = require("../../models/cartProduct");
const stripe = require('stripe')('sk_test_51PJVJZSGpZvoPybBYEufDLfAHcVXwiHaWRJugJpwhjZOAIZs7giMxWe6YRpiIfgZSWBMYdv4Kib76McP8bEtLQqP00HRQH2rYz');

const userCheckout = async (req, res) => {
    try {
        const currentUser = req.userId;
        const allProduct = await addToCartModel.find({ userId: currentUser }).populate("productId");

        if (!allProduct || allProduct.length === 0) {
            return res.json({ success: false, error: true, message: "No products found in the cart! Please add Items to the Cart first!" });
        }

        const lineItems = allProduct.map((product, index) => {
            console.log(`Product ${index + 1}:`, product); // Log product details
            console.log(`Selling Price of Product ${index + 1}:`, product.productId.sellingPrice); // Log selling price
            const sellingPrice = product.productId.sellingPrice || 0; // Use 0 if sellingPrice is undefined
            const productImages = product.productId.productImage; // Array of product images
            const firstImage = productImages && productImages.length > 0 ? productImages[0] : '';
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.productId.productName,
                        images: firstImage ? [firstImage] : [],
                    },
                    unit_amount: sellingPrice * 100,
                },
                quantity: product.quantity
            }
        });

        console.log("Line Items:", lineItems); // Log line items before sending to Stripe

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        console.log("Checkout Session:", session); // Log created checkout session

        res.json({
            id: session.id, success: true,
            error: false, message: "please make the payment carefully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred during checkout' });
    }
}

module.exports = userCheckout;

