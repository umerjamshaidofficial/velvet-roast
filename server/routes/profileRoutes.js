const express = require('express');
const router = express.Router();
const { pool } = require('../config/db'); 
const { protect } = require('../middleware/authMiddleware'); 

// --- SECTION 1: IDENTITY ---

router.get('/me', protect, async (req, res) => {
    try {
        const profile = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [req.user.id]);
        
        // Only fetch addresses where is_active is TRUE
        const addresses = await pool.query(
            'SELECT * FROM user_addresses WHERE user_id = $1 AND is_active = TRUE ORDER BY created_at DESC', 
            [req.user.id]
        );
        
        res.json({
            profile: profile.rows[0] || { first_name: '', last_name: '', preferred_roast: 'Dark', brew_method: 'Pour Over' },
            addresses: addresses.rows || []
        });
    } catch (err) {
        console.error("Fetch Profile Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/update', protect, async (req, res) => {
    const { firstName, lastName, preferredRoast, brewMethod } = req.body;
    try {
        const updatedProfile = await pool.query(
            `UPDATE user_profiles 
             SET first_name = $1, last_name = $2, preferred_roast = $3, brew_method = $4 
             WHERE user_id = $5 RETURNING *`,
            [firstName, lastName, preferredRoast, brewMethod, req.user.id]
        );
        res.json(updatedProfile.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SECTION 2: DESTINATIONS ---

router.post('/addresses', protect, async (req, res) => {
    const { full_name, street_address, city, postal_code, label } = req.body;
    try {
        const newAddress = await pool.query(
            `INSERT INTO user_addresses (user_id, full_name, street_address, city, postal_code, label, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING *`,
            [req.user.id, full_name, street_address, city, postal_code, label || 'Home']
        );
        res.status(201).json(newAddress.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/addresses/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { street_address, city, postal_code, label } = req.body;
    try {
        const updated = await pool.query(
            `UPDATE user_addresses 
             SET street_address = $1, city = $2, postal_code = $3, label = $4 
             WHERE id = $5 AND user_id = $6 AND is_active = TRUE RETURNING *`,
            [street_address, city, postal_code, label, id, req.user.id]
        );
        
        if (updated.rowCount === 0) return res.status(404).json({ message: "Not found" });
        res.json(updated.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SOFT DELETE: This prevents the Foreign Key Error
router.delete('/addresses/:id', protect, async (req, res) => {
    const { id } = req.params;
    console.log(`SOFT DELETE TRIGGERED for ID: ${id}`); // CHECK YOUR TERMINAL FOR THIS

    try {
        // We use UPDATE instead of DELETE so the orders table doesn't complain
        const result = await pool.query(
            'UPDATE user_addresses SET is_active = FALSE WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        
        if (result.rowCount === 0) return res.status(404).json({ message: "Destination not found" });
        res.json({ message: "Success" });
    } catch (err) {
        console.error("Soft Delete Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;