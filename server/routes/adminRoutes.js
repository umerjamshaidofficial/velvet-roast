const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Setup image storage logic
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `ritual-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// --- DASHBOARD ROUTES ---

router.get('/overview', async (req, res) => {
  try {
    const revenueResult = await db.query('SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM "orders" WHERE status = \'delivered\'');
    const ordersResult = await db.query('SELECT COUNT(*) as total_orders FROM "orders"');
    const pendingResult = await db.query("SELECT COUNT(*) as pending_orders FROM \"orders\" WHERE status = 'pending'");
    const usersResult = await db.query('SELECT COUNT(*) as total_users FROM "users"');

    const recentOrders = await db.query(`
      SELECT o.id, o.status, 
      COALESCE(u.first_name, SPLIT_PART(u.email, '@', 1)) as first_name, 
      COALESCE(u.last_name, '') as last_name 
      FROM "orders" o 
      LEFT JOIN "users" u ON o.user_id = u.id 
      ORDER BY o.id DESC LIMIT 5
    `);

    res.json({
      stats: {
        totalRevenue: parseFloat(revenueResult.rows[0].total_revenue).toFixed(2),
        totalOrders: parseInt(ordersResult.rows[0].total_orders),
        pendingOrders: parseInt(pendingResult.rows[0].pending_orders),
        totalUsers: parseInt(usersResult.rows[0].total_users)
      },
      recentOrders: recentOrders.rows
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// --- GIFT REGISTRY ROUTE (UPDATED) ---

router.get('/gifts', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id, 
        COALESCE(o.recipient_name, 'Guest') as recipient_name,
        o.recipient_email, 
        COALESCE(o.gift_message, 'No message provided.') as message, 
        o.status, 
        o.gratitude_sent as converted,
        o.created_at,
        TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) as sender_name,
        u.email as sender_email,
        EXTRACT(DAY FROM (NOW() - o.created_at)) as days_ago
      FROM "orders" o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.is_gift = true
      ORDER BY o.created_at DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ ADMIN GIFTS FETCH ERROR:", err.message);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

// --- ORDER & USER ROUTES ---

router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, first_name, last_name, email, role FROM "users" ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, u.email,
      COALESCE(u.first_name, SPLIT_PART(u.email, '@', 1)) as first_name
      FROM "orders" o 
      LEFT JOIN "users" u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE "orders" SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;