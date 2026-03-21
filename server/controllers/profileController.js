const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile and addresses
// @route   GET /api/profile/me
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        // 1. Fetch User Profile Data (including Google ID check)
        const userRes = await pool.query(
            `SELECT id, username, email, role, profile_pic AS "profilePic", is_member, 
             first_name AS "firstName", last_name AS "lastName", preferred_roast, brew_method, google_id 
             FROM users WHERE id = $1`, 
            [req.user.id]
        );

        if (userRes.rows.length === 0) {
            return res.status(404).json({ message: "User not found in sanctuary" });
        }

        // 2. Fetch User Addresses
        const addressRes = await pool.query(
            `SELECT id, full_name, street_address, city, postal_code, label 
             FROM addresses WHERE user_id = $1 ORDER BY id DESC`,
            [req.user.id]
        );

        // Return combined data structure
        // Note: Using the spread operator to match the frontend expectation of profile properties
        res.json({
            profile: userRes.rows[0],
            addresses: addressRes.rows
        });
    } catch (err) {
        console.error("Error fetching profile:", err.message);
        res.status(500).json({ message: "Server error fetching sanctuary data" });
    }
};

// @desc    Update user identity (Names, Rituals, and Password)
// @route   PUT /api/profile/update
// @access  Private
exports.updateProfile = async (req, res) => {
    const { firstName, lastName, preferredRoast, brewMethod, newPassword } = req.body;
    
    try {
        // Check if the user is a Google User (Security check) using the middleware data
        const isGoogleUser = !!req.user.google_id;

        let query = `UPDATE users SET first_name = $1, last_name = $2, preferred_roast = $3, brew_method = $4`;
        let params = [firstName, lastName, preferredRoast, brewMethod];

        // Password Update Logic - ensuring we use "password_hash" to match your authController
        if (newPassword && !isGoogleUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(newPassword, salt);
            
            query += `, password_hash = $5 WHERE id = $6 RETURNING *`;
            params.push(hashedPass, req.user.id);
        } else {
            query += ` WHERE id = $5 RETURNING *`;
            params.push(req.user.id);
        }

        const updated = await pool.query(query, params);
        
        res.json({
            message: "Identity updated successfully",
            user: updated.rows[0]
        });
    } catch (err) {
        console.error("Update failed:", err.message);
        res.status(500).json({ message: "Failed to update sanctuary identity" });
    }
};

// @desc    Add a new shipping destination
// @route   POST /api/profile/addresses
// @access  Private
exports.addAddress = async (req, res) => {
    const { full_name, street_address, city, postal_code, label } = req.body;
    try {
        const newAddr = await pool.query(
            `INSERT INTO addresses (user_id, full_name, street_address, city, postal_code, label) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [req.user.id, full_name, street_address, city, postal_code, label]
        );
        res.status(201).json(newAddr.rows[0]);
    } catch (err) {
        console.error("Add address error:", err.message);
        res.status(500).json({ message: "Failed to add destination" });
    }
};

// @desc    Update an existing destination
// @route   PUT /api/profile/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { full_name, street_address, city, postal_code, label } = req.body;
    try {
        const updated = await pool.query(
            `UPDATE addresses 
             SET full_name = $1, street_address = $2, city = $3, postal_code = $4, label = $5 
             WHERE id = $6 AND user_id = $7 RETURNING *`,
            [full_name, street_address, city, postal_code, label, id, req.user.id]
        );
        
        if (updated.rows.length === 0) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.json(updated.rows[0]);
    } catch (err) {
        console.error("Update address error:", err.message);
        res.status(500).json({ message: "Update destination failed" });
    }
};

// @desc    Remove a destination (Hard delete)
// @route   DELETE /api/profile/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *', 
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Destination not found or unauthorized" });
        }

        res.json({ message: "Destination removed from sanctuary" });
    } catch (err) {
        console.error("Delete address error:", err.message);
        res.status(500).json({ message: "Error deleting destination" });
    }
};