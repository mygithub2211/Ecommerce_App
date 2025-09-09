/*import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.json("should be a POST request")
        return
    }
    const { 
        name, email, city, whichState, postalCode, 
        streetAddress, country, cartProducts
    } = req.body;
    await mongooseConnect()
    const productsIds = cartProducts
    const uniqueIds = [...new Set(productsIds)]
    const productsInfos = await Product.find({_id:uniqueIds})
    
    let line_items = []
    for(const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId)
        const quantity = productsIds.filter(id => id === productId)?.length || 0
        if(quantity > 0 && productInfo) {
            line_items.push({
                quantity,
                price_data:{
                    currency:'USD',
                    product_data:{name:productInfo.title},
                    unit_amount: Math.round(Number(productInfo.price) * 100),
                }
            })
        }
    }

    const orderDoc = await Order.create({
        line_items, name, email, city, whichState, postalCode, streetAddress, country, paid:false
    })

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode:'payment',
        customer_email:email,
        success_url:process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url:process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata:{orderId:orderDoc._id.toString(), test:'ok'}
    })

    res.json({
        url:session.url
    })
}*/


import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK);

function computeOrigin(req) {
  try {
    const proto = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    if (host) return `${proto}://${host}`.replace(/\/$/, "");
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  } catch (_) {}
  return "http://localhost:3001";
}

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.json("should be a POST request")
        return
    }

    const { 
        name, email, city, whichState, postalCode, 
        streetAddress, country, cartProducts
    } = req.body;

    await mongooseConnect()
    const productsIds = cartProducts
    const uniqueIds = [...new Set(productsIds)]
    const productsInfos = await Product.find({_id:uniqueIds})
    
    let line_items = []
    for(const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId)
        const quantity = productsIds.filter(id => id === productId)?.length || 0
        if(quantity > 0 && productInfo) {
            line_items.push({
                quantity,
                price_data:{
                    currency:'USD',
                    product_data:{name:productInfo.title},
                    unit_amount: Math.round(Number(productInfo.price) * 100),
                }
            })
        }
    }

    line_items = line_items.map(item => ({
      ...item,
      price_data: {
        ...item.price_data,
        currency: String(item.price_data?.currency || 'usd').toLowerCase(),
        unit_amount: Math.round(Number(item.price_data?.unit_amount || 0)),
      },
    }));

    const orderDoc = await Order.create({
        line_items, name, email, city, whichState, postalCode, streetAddress, country, paid:false
    })

    const origin = computeOrigin(req);

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode:'payment',
        customer_email:email,
        success_url: `${origin}/cart?success=1`,
        cancel_url:  `${origin}/cart?canceled=1`,
        metadata:{orderId:orderDoc._id.toString(), test:'ok'}
    })

    res.json({
        url:session.url
    })
}

