const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// Ensure upload folder exists
const uploadDir = "./upload/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve images statically
app.use("/images", express.static(uploadDir));

// MongoDB connection
const mongoUri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Ecommerce";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Multer storage config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM } = process.env;
let mailTransporter = null;
let useTestAccount = false;

const getMailTransporter = async () => {
  if (mailTransporter) return mailTransporter;

  if (MAIL_HOST && MAIL_PORT && MAIL_USER && MAIL_PASS && MAIL_FROM) {
    mailTransporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      secure: Number(MAIL_PORT) === 465,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });
    useTestAccount = false;
    return mailTransporter;
  }

  const testAccount = await nodemailer.createTestAccount();
  mailTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  useTestAccount = true;
  console.log("No email config found. Using Ethereal test account for order emails.");
  return mailTransporter;
};

const sendOrderConfirmationEmail = async (customer, order) => {
  if (!customer.email) return false;

  const transporter = await getMailTransporter();
  if (!transporter) return false;

  const mailOptions = {
    from: MAIL_FROM || 'no-reply@example.com',
    to: customer.email,
    subject: 'Your order has been placed successfully',
    text: `Hi ${customer.name || 'Customer'},\n\nYour order #${order.orderId} has been placed successfully.\nTotal: Ksh ${order.total}.\n\nThank you for shopping with us!\n\nWe will contact you once your order is being prepared.`,
    html: `<p>Hi ${customer.name || 'Customer'},</p><p>Your order <strong>#${order.orderId}</strong> has been placed successfully.</p><p><strong>Total:</strong> Ksh ${order.total}</p><p>Thank you for shopping with us! We will contact you once your order is being prepared.</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  const previewUrl = useTestAccount ? nodemailer.getTestMessageUrl(info) : null;
  if (previewUrl) {
    console.log('Preview email at:', previewUrl);
  }
  return { sent: Boolean(info.messageId), previewUrl };
};

// Upload endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.json({
      success: true,
      image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Product schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, required: true },
  items: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      category: { type: String, required: true },
      new_price: { type: Number, required: true },
      old_price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  customer: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// Add product
app.post("/addproduct", async (req, res) => {
  try {
    const { name, image, category, new_price, old_price, available } = req.body;
    if (!name || !image || !category || new_price === undefined || old_price === undefined) {
      return res.status(400).json({ success: false, message: "Missing required product fields." });
    }

    // Auto-generate ID
    const lastProduct = await Product.findOne({}).sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      id,
      name,
      image,
      category,
      new_price: Number(new_price),
      old_price: Number(old_price),
      available: available !== undefined ? available : true,
    });

    await newProduct.save();
    console.log("Product saved:", newProduct);
    res.json({ success: true, name: newProduct.name });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove product
app.post("/removeproduct", async (req, res) => {
  try {
    const query = {};
    if (req.body.id) {
      query.id = Number(req.body.id);
    }
    if (req.body._id) {
      query._id = req.body._id;
    }

    const deleted = await Product.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });
    console.log("Product deleted:", deleted);
    res.json({ success: true, name: deleted.name });
  } catch (err) {
    console.error("Remove product error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ id: 1 });
    res.json(products);
  } catch (err) {
    console.error("Get all products error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const { email, orderId } = req.query;
    const filter = {};

    if (email) {
      filter["customer.email"] = email;
    }
    if (orderId) {
      filter.orderId = Number(orderId);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: Number(req.params.orderId) });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: Number(req.params.orderId) },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create an order
app.post("/createorder", async (req, res) => {
  try {
    const lastOrder = await Order.findOne({}).sort({ orderId: -1 });
    const orderId = lastOrder ? lastOrder.orderId + 1 : 1;

    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must include at least one item." });
    }

    const customer = {
      name: req.body.customer?.name || "",
      email: req.body.customer?.email || "",
      phone: req.body.customer?.phone || "",
      address: req.body.customer?.address || "",
    };

    if (!customer.email) {
      return res.status(400).json({ success: false, message: "Customer email is required for order placement." });
    }

    const total = Number(req.body.total);
    if (Number.isNaN(total) || total <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order total." });
    }

    const newOrder = new Order({
      orderId,
      items: req.body.items,
      total,
      customer,
      status: req.body.status || "pending",
    });

    await newOrder.save();
    let emailResult = { sent: false, previewUrl: null };
    try {
      emailResult = await sendOrderConfirmationEmail(newOrder.customer, newOrder);
    } catch (emailError) {
      console.error("Order confirmation email error:", emailError);
    }

    console.log("Order saved:", newOrder);
    res.json({ success: true, orderId: newOrder.orderId, emailSent: emailResult.sent, emailPreviewUrl: emailResult.previewUrl });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});