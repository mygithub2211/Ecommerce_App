import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import  { buffer } from "micro"

const endpointSecret = "whsec_4663bfa42b9219135fe40938fb0febdd1571e0ee04b34a632cf4673f300f7ced";

export default async function handler(req, res) {
    await mongooseConnect()
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object
            const orderId = data.metadata.orderId
            const paid = data.payment_status === 'paid'
            if(orderId && paid) {
                await Order.findByIdAndUpdate(orderId, {
                    paid:true
                })
            }
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('ok')
}

export const config = {
    api: {bodyParser:false}
}

//evenly-loves-whoa-worth
//acct_1Pn6Xx09YiVM6KIR
