import Stripe from "stripe";
import Provider from "../models/Provider.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      
      if (session.metadata.type === "provider_subscription") {
        const subscriptionId = session.metadata.subscriptionId;
        const providerId = session.metadata.providerId;

        const Subscription = (await import("../models/Subscription.js")).default;
        const subscription = await Subscription.findById(subscriptionId);

        if (subscription) {
          subscription.paymentStatus = "paid";
          subscription.paidAt = new Date();
          subscription.status = "Active";
          await subscription.save();

          await Provider.findByIdAndUpdate(providerId, {
            currentSubscriptionId: subscriptionId,
          });

          console.log("Provider subscription payment completed:", subscriptionId);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const createSubscriptionPayment = async (req, res, next) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Subscription ID is required",
      });
    }

    const Subscription = (await import("../models/Subscription.js")).default;
    const subscription = await Subscription.findById(subscriptionId).populate(
      "provider_id",
      "name email stripeCustomerId"
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    if (subscription.provider_id._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You can only pay for your own subscriptions",
      });
    }

    if (subscription.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "This subscription has already been paid",
      });
    }

    const provider = subscription.provider_id;
    let stripeCustomerId = provider.stripeCustomerId;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: provider.email,
        name: provider.name,
        metadata: {
          providerId: req.user.id,
          role: "provider",
        },
      });
      stripeCustomerId = stripeCustomer.id;

      await Provider.findByIdAndUpdate(req.user.id, {
        stripeCustomerId: stripeCustomerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${subscription.plan_name} Subscription Plan`,
              description: `Subscription from ${new Date(
                subscription.start_date
              ).toLocaleDateString()} to ${new Date(
                subscription.end_date
              ).toLocaleDateString()}`,
            },
            unit_amount: Math.round(subscription.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/provider/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/provider/subscription/cancel`,
      metadata: {
        subscriptionId: subscriptionId,
        providerId: req.user.id,
        type: "provider_subscription",
      },
    });

    subscription.stripeCheckoutSessionId = session.id;
    await subscription.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderSubscriptionStatus = async (req, res, next) => {
  try {
    const Subscription = (await import("../models/Subscription.js")).default;

    const provider = await Provider.findById(req.user.id).populate(
      "currentSubscriptionId"
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const subscriptions = await Subscription.find({
      provider_id: req.user.id,
    }).sort({ createdAt: -1 });

    const activeSubscription = subscriptions.find(
      (sub) => sub.status === "Active" && sub.paymentStatus === "paid"
    );

    const pendingSubscription = subscriptions.find(
      (sub) => sub.paymentStatus === "pending"
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        activeSubscription: activeSubscription || null,
        pendingSubscription: pendingSubscription || null,
        allSubscriptions: subscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};
