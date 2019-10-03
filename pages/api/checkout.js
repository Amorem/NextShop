import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import calculateCartTotal from "../../utils/calculateCartTotal";
import CartSummary from "../../components/Cart/CartSummary";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { payementData } = req.body;

  try {
    // 1. Verify and get userId from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    // 2. Find cart based on userId, populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });

    // 3. Calculate cart totals again from cart products
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);

    // 4. Get the email from payement data, see if email linked with existing Stripe customer
    const previousCustomer = await stripe.customers.list({
      email: payementData.email,
      limit: 1
    });
    const isExistingCustomer = previousCustomer.data.length > 0;

    // 5. If not existing customer, create them based on their email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: payementData.email,
        source: payementData.id
      });
    }
    const customer =
      (isExistingCustomer && previousCustomer.data[0].id) || newCustomer.id;

    // 6. Create a charge with the total and send receipt email
    const charge = await stripe.charges.create(
      {
        currency: "usd",
        amount: stripeTotal,
        receipt_email: payementData.email,
        customer,
        description: `Checkout | ${payementData.email}`
      },
      { idempotency_key: uuidv4() }
    );

    // 7. Add the order data to database
    await new Order({
      user: userId,
      email: payementData.email,
      total: cartTotal,
      products: cart.products
    }).save();

    // 8. Clear products in cart
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });

    // 9. Send back success response
    res.status(200).send("Checkout successful");
  } catch (error) {
    res.status(500).send("Error processing charge");
  }
};
