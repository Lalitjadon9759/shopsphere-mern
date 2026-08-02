const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderName: {
            type: String,
            required: true
        },
        orderAmount: {
            type: Number,
            required: true
        },
        deliveryStatus: {
            type: Boolean,
            default: false
        },
        modeOfPayment: {
            type: String,
            enum: ["cod", "upi"]
        },
        orderedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);