// api/create-checkout-session.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')("sk_test_51O9nO6DzfAzbhczjJI27Vix4L5AFMBQDTEd7thTsS46FhRHpnY5IOjRxhu4pPkDEIcV1UAqWy7KrStPVewduqjZg00rICMT23A");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.options('/create-checkout-session', cors());

app.post('/create-checkout-session', async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://spireassist.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation',
          },
          unit_amount: req.body.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.URL}/success`, // Replace with your actual success URL
      cancel_url: `${process.env.URL}/error`,   // Replace with your actual error URL
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
