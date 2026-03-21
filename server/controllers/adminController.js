const db = require('../config/db');

exports.getDashboardOverview = async (req, res) => {
  try {
    const userCount = await db.query("SELECT COUNT(*) FROM users");
    const orderCount = await db.query("SELECT COUNT(*) FROM orders");
    const pendingCount = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
    const revenue = await db.query("SELECT SUM(total_amount) FROM orders WHERE status = 'delivered'");

    const recentOrders = await db.query(`
      SELECT o.id, o.status, o.total_amount, o.created_at, 
      COALESCE(u.first_name, '') as first_name, 
      COALESCE(u.last_name, '') as last_name,
      u.username
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 10
    `);

    const recentSubs = await db.query(`
      SELECT first_name, last_name, member_since 
      FROM users 
      WHERE is_member = true 
      ORDER BY member_since DESC 
      LIMIT 5
    `);

    res.status(200).json({
      stats: {
        totalUsers: parseInt(userCount.rows[0].count),
        totalOrders: parseInt(orderCount.rows[0].count),
        pendingOrders: parseInt(pendingCount.rows[0].count),
        totalRevenue: parseFloat(revenue.rows[0].sum || 0).toFixed(2)
      },
      recentOrders: recentOrders.rows,
      recentSubscriptions: recentSubs.rows
    });
  } catch (err) {
    console.error("Admin Stats Error:", err.message);
    res.status(500).json({ message: "Admin data fetch failed" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", 
      [status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order updated", order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, first_name, last_name, email, username, role, is_member, member_since FROM users ORDER BY member_since DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Fetch Users Error:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// FIXED: Concatenating address, city, and postal_code to show the full address
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.id, 
        o.total_amount, 
        o.status, 
        o.created_at,
        u.email,
        COALESCE(u.first_name, '') as first_name,
        COALESCE(u.last_name, '') as last_name,
        u.username,
        CASE 
          WHEN o.address IS NOT NULL THEN CONCAT(o.address, ', ', o.city, ' ', o.postal_code)
          ELSE 'Pickup Selected'
        END as shipping_address
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Fetch All Orders Error:", err.message);
    res.status(500).json({ message: "Failed to fetch order history." });
  }
};