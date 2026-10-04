// import crypto from "crypto";
// import db from "../models/index.js";

// const { Order } = db;

// const paystackRequest = async (path, options = {}) => {
//   const secret = process.env.PAYSTACK_SECRET_KEY;
//   if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured.");

//   const response = await fetch(`https://api.paystack.co${path}`, {
//     ...options,
//     headers: {
//       Authorization: `Bearer ${secret}`,
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//   });

//   const data = await response.json().catch(() => ({}));
//   if (!response.ok || data.status === false) {
//     throw new Error(data.message || "Paystack request failed.");
//   }

//   return data;
// };

// export const getBankTransferInfo = async (_req, res) => {
//   return res.json({
//     bankName: process.env.BANK_NAME || "G3 Store Bank Account",
//     accountName: process.env.BANK_ACCOUNT_NAME || "G3 Store",
//     accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
//     instructions: process.env.BANK_TRANSFER_INSTRUCTIONS || "Transfer the exact order total, then send your receipt to G3 WhatsApp for verification.",
//     whatsappNumber: process.env.WHATSAPP_NUMBER || "",
//   });
// };

// export const initializePayment = async (req, res) => {
//   try {
//     const { orderId, callbackUrl } = req.body;
//     const order = await Order.findOne({ where: { id: orderId, userId: req.user.id } });

//     if (!order) return res.status(404).json({ message: "Order not found." });
//     if (order.paymentStatus === "paid") return res.status(409).json({ message: "This order has already been paid." });
//     if (order.status === "cancelled") return res.status(409).json({ message: "This order has been cancelled." });

//     const data = await paystackRequest("/transaction/initialize", {
//       method: "POST",
//       body: JSON.stringify({
//         email: order.customerEmail,
//         amount: Math.round(Number(order.total) * 100),
//         reference: order.orderNumber,
//         callback_url: callbackUrl || process.env.PAYSTACK_CALLBACK_URL || undefined,
//         metadata: {
//           orderId: order.id,
//           orderNumber: order.orderNumber,
//           userId: req.user.id,
//         },
//       }),
//     });

//     await order.update({
//       paymentReference: data.data.reference,
//       paymentMethod: "paystack",
//     });

//     return res.json({
//       message: "Payment initialized.",
//       authorizationUrl: data.data.authorization_url,
//       accessCode: data.data.access_code,
//       reference: data.data.reference,
//     });
//   } catch (error) {
//     console.error("Initialize payment error:", error);
//     return res.status(503).json({ message: error.message || "Could not initialize payment." });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   try {
//     const reference = req.params.reference;
//     const order = await Order.findOne({
//       where: { userId: req.user.id, paymentReference: reference },
//     });

//     if (!order) return res.status(404).json({ message: "Payment/order reference not found." });

//     const data = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
//     const transaction = data.data;

//     if (transaction.status === "success") {
//       await order.update({
//         paymentStatus: "paid",
//         status: order.status === "pending" ? "processing" : order.status,
//         paidAt: order.paidAt || new Date(),
//         paymentMethod: "paystack",
//       });
//     } else if (["failed", "abandoned"].includes(transaction.status)) {
//       await order.update({ paymentStatus: "failed" });
//     }

//     return res.json({
//       verified: transaction.status === "success",
//       paymentStatus: order.paymentStatus,
//       orderStatus: order.status,
//       reference,
//     });
//   } catch (error) {
//     console.error("Verify payment error:", error);
//     return res.status(503).json({ message: error.message || "Could not verify payment." });
//   }
// };

// export const handlePaystackWebhook = async (req, res) => {
//   try {
//     const secret = process.env.PAYSTACK_SECRET_KEY;
//     const signature = req.headers["x-paystack-signature"];
//     const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));

//     if (!secret || !signature) return res.sendStatus(401);

//     const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
//     const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
//     if (!valid) return res.sendStatus(401);

//     const event = req.body;
//     const reference = event?.data?.reference;
//     if (!reference) return res.sendStatus(200);

//     const order = await Order.findOne({ where: { paymentReference: reference } });
//     if (!order) return res.sendStatus(200);

//     if (event.event === "charge.success") {
//       await order.update({
//         paymentStatus: "paid",
//         status: order.status === "pending" ? "processing" : order.status,
//         paidAt: order.paidAt || new Date(),
//         paymentMethod: "paystack",
//       });
//     }

//     if (event.event === "charge.failed") {
//       await order.update({ paymentStatus: "failed" });
//     }

//     return res.sendStatus(200);
//   } catch (error) {
//     console.error("Paystack webhook error:", error);
//     return res.sendStatus(500);
//   }
// };



import crypto from "crypto";
import db from "../models/index.js";

const { Order } = db;

const PAYSTACK_API_BASE = "https://api.paystack.co";
const PAYMENT_CURRENCY = process.env.PAYSTACK_CURRENCY || "NGN";

/**
 * Convert a naira amount to Paystack's smallest currency unit.
 *
 * Example:
 * ₦5,000 → 500000 kobo
 */
const toSubunit = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Invalid payment amount.");
  }

  return Math.round(value * 100);
};

/**
 * Make an authenticated request to Paystack.
 */
const paystackRequest = async (path, options = {}) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const response = await fetch(`${PAYSTACK_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.status === false) {
    throw new Error(data.message || "Paystack request failed.");
  }

  return data;
};

/**
 * Safely validate a Paystack webhook signature.
 */
const isValidPaystackSignature = (rawBody, signature, secret) => {
  if (!rawBody || !signature || !secret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  const receivedBuffer = Buffer.from(String(signature), "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
};

/**
 * Validate that a successful Paystack transaction actually belongs
 * to the order and has the correct amount/currency.
 */
const validateSuccessfulTransaction = (transaction, order) => {
  if (!transaction) {
    return {
      valid: false,
      message: "Paystack returned an invalid transaction response.",
    };
  }

  if (transaction.status !== "success") {
    return {
      valid: false,
      message: `Paystack transaction status is ${transaction.status || "unknown"}.`,
    };
  }

  const expectedAmount = toSubunit(order.total);
  const actualAmount = Number(transaction.amount);

  if (!Number.isFinite(actualAmount) || actualAmount !== expectedAmount) {
    return {
      valid: false,
      message: "Payment amount does not match the order total.",
    };
  }

  const transactionCurrency = String(
    transaction.currency || ""
  ).toUpperCase();

  if (transactionCurrency !== PAYMENT_CURRENCY.toUpperCase()) {
    return {
      valid: false,
      message: "Payment currency does not match the order currency.",
    };
  }

  const transactionReference = String(transaction.reference || "");
  const orderReference = String(order.paymentReference || "");

  if (!transactionReference || transactionReference !== orderReference) {
    return {
      valid: false,
      message: "Payment reference does not match the order.",
    };
  }

  return {
    valid: true,
    message: "Payment verified successfully.",
  };
};

/**
 * Mark an order as paid.
 *
 * This operation is intentionally idempotent. If Paystack sends the
 * same webhook more than once, the order remains safely marked as paid.
 */
const markOrderAsPaid = async (order) => {
  const updates = {
    paymentStatus: "paid",
    status: order.status === "pending" ? "processing" : order.status,
    paidAt: order.paidAt || new Date(),
    paymentMethod: "paystack",
  };

  await order.update(updates);

  return order;
};

/**
 * Get bank-transfer information.
 */
export const getBankTransferInfo = async (_req, res) => {
  return res.json({
    bankName: process.env.BANK_NAME || "G3 Store Bank Account",
    accountName: process.env.BANK_ACCOUNT_NAME || "G3 Store",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
    instructions:
      process.env.BANK_TRANSFER_INSTRUCTIONS ||
      "Transfer the exact order total, then send your receipt to G3 WhatsApp for verification.",
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
  });
};

/**
 * Initialize a Paystack transaction.
 *
 * POST /api/v1/payments/initialize
 */
export const initializePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required.",
      });
    }

    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(409).json({
        message: "This order has already been paid.",
      });
    }

    if (order.status === "cancelled") {
      return res.status(409).json({
        message: "This order has been cancelled.",
      });
    }

    const amount = toSubunit(order.total);

    if (amount <= 0) {
      return res.status(400).json({
        message: "The order total must be greater than zero.",
      });
    }

    /**
     * We prefer the backend-configured callback URL.
     *
     * This prevents a client from supplying an arbitrary callback URL
     * in production.
     */
    const callbackUrl =
      process.env.PAYSTACK_CALLBACK_URL ||
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/order-success`;

    const data = await paystackRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: order.customerEmail,
        amount,
        currency: PAYMENT_CURRENCY,
        reference: order.orderNumber,
        callback_url: callbackUrl,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: req.user.id,
        },
      }),
    });

    const paymentReference = data?.data?.reference;

    if (!paymentReference) {
      throw new Error("Paystack did not return a payment reference.");
    }

    await order.update({
      paymentReference,
      paymentMethod: "paystack",
    });

    return res.json({
      message: "Payment initialized.",
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: paymentReference,
    });
  } catch (error) {
    console.error("Initialize payment error:", error);

    return res.status(503).json({
      message: error.message || "Could not initialize payment.",
    });
  }
};

/**
 * Verify a Paystack transaction from the frontend callback.
 *
 * GET /api/v1/payments/verify/:reference
 */
export const verifyPayment = async (req, res) => {
  try {
    const reference = String(req.params.reference || "").trim();

    if (!reference) {
      return res.status(400).json({
        message: "Payment reference is required.",
      });
    }

    const order = await Order.findOne({
      where: {
        userId: req.user.id,
        paymentReference: reference,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Payment/order reference not found.",
      });
    }

    /**
     * If the webhook already confirmed this payment, we don't need
     * to perform another state transition.
     */
    if (order.paymentStatus === "paid") {
      return res.json({
        verified: true,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        reference,
        message: "Payment has already been confirmed.",
      });
    }

    const data = await paystackRequest(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );

    const transaction = data?.data;

    if (!transaction) {
      return res.status(502).json({
        message: "Paystack did not return transaction details.",
      });
    }

    /**
     * Paystack must report the exact expected amount, currency,
     * reference and successful status before we mark the order paid.
     */
    if (transaction.status === "success") {
      const validation = validateSuccessfulTransaction(transaction, order);

      if (!validation.valid) {
        console.error("Payment validation failed:", {
          orderId: order.id,
          orderNumber: order.orderNumber,
          reference,
          reason: validation.message,
          expectedAmount: toSubunit(order.total),
          receivedAmount: transaction.amount,
          expectedCurrency: PAYMENT_CURRENCY,
          receivedCurrency: transaction.currency,
        });

        return res.status(400).json({
          verified: false,
          paymentStatus: order.paymentStatus,
          orderStatus: order.status,
          reference,
          message: validation.message,
        });
      }

      await markOrderAsPaid(order);

      return res.json({
        verified: true,
        paymentStatus: "paid",
        orderStatus: order.status,
        reference,
        message: "Payment verified successfully.",
      });
    }

    /**
     * These statuses should not be treated as successful payments.
     */
    if (["failed", "abandoned"].includes(transaction.status)) {
      await order.update({
        paymentStatus: "failed",
      });

      return res.json({
        verified: false,
        paymentStatus: "failed",
        orderStatus: order.status,
        reference,
        message: "The Paystack payment was not successful.",
      });
    }

    /**
     * Other statuses can mean that Paystack has not completed the
     * transaction yet.
     */
    return res.json({
      verified: false,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      reference,
      message:
        "The payment has not been confirmed yet. Please check your order status again shortly.",
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(503).json({
      message: error.message || "Could not verify payment.",
    });
  }
};

/**
 * Paystack webhook.
 *
 * POST /api/v1/payments/webhook
 *
 * Paystack calls this endpoint directly from its servers.
 */
export const handlePaystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers["x-paystack-signature"];

    if (!secret) {
      console.error(
        "Paystack webhook rejected: PAYSTACK_SECRET_KEY is not configured."
      );

      return res.sendStatus(401);
    }

    if (!signature) {
      console.error("Paystack webhook rejected: missing signature.");
      return res.sendStatus(401);
    }

    /**
     * server.js stores the original JSON request body as req.rawBody.
     * This is important because Paystack signs the raw request body.
     */
    const rawBody =
      req.rawBody ||
      Buffer.from(JSON.stringify(req.body || {}), "utf8");

    const validSignature = isValidPaystackSignature(
      rawBody,
      signature,
      secret
    );

    if (!validSignature) {
      console.error("Paystack webhook rejected: invalid signature.");
      return res.sendStatus(401);
    }

    const event = req.body;
    const reference = String(event?.data?.reference || "").trim();

    /**
     * Unknown/non-payment events are acknowledged so Paystack doesn't
     * keep retrying a webhook we don't need.
     */
    if (!reference) {
      return res.sendStatus(200);
    }

    const order = await Order.findOne({
      where: {
        paymentReference: reference,
      },
    });

    /**
     * If G3 cannot find the order, acknowledge the webhook rather than
     * repeatedly asking Paystack to resend an event we cannot process.
     */
    if (!order) {
      console.warn(
        `Paystack webhook received for unknown reference: ${reference}`
      );

      return res.sendStatus(200);
    }

    /**
     * Payment was already confirmed.
     *
     * Paystack can retry webhooks, so this prevents duplicate state
     * changes.
     */
    if (order.paymentStatus === "paid") {
      return res.sendStatus(200);
    }

    /**
     * Successful charge.
     */
    if (event.event === "charge.success") {
      const transaction = event.data;

      const validation = validateSuccessfulTransaction(
        transaction,
        order
      );

      if (!validation.valid) {
        console.error("Paystack webhook payment validation failed:", {
          orderId: order.id,
          orderNumber: order.orderNumber,
          reference,
          reason: validation.message,
          expectedAmount: toSubunit(order.total),
          receivedAmount: transaction?.amount,
          expectedCurrency: PAYMENT_CURRENCY,
          receivedCurrency: transaction?.currency,
        });

        /**
         * We acknowledge the webhook but DO NOT mark the order as paid.
         */
        return res.sendStatus(200);
      }

      await markOrderAsPaid(order);

      console.log(
        `Paystack payment confirmed: ${order.orderNumber} (${reference})`
      );

      return res.sendStatus(200);
    }

    /**
     * Failed charge.
     */
    if (event.event === "charge.failed") {
      await order.update({
        paymentStatus: "failed",
      });

      console.log(
        `Paystack payment failed: ${order.orderNumber} (${reference})`
      );

      return res.sendStatus(200);
    }

    /**
     * We don't currently need to process other Paystack events.
     */
    return res.sendStatus(200);
  } catch (error) {
    console.error("Paystack webhook error:", error);

    /**
     * Returning 500 tells Paystack that processing failed, allowing
     * Paystack to retry the webhook.
     */
    return res.sendStatus(500);
  }
};