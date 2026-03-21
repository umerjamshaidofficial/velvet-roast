const { pool } = require('../config/db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

// --- HELPER FUNCTIONS ---
/**
 * Generates a JWT token for authenticated sessions
 * @param {string} id - The user's database ID
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

// --- REGISTER LOGIC ---
exports.registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Username or Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      "INSERT INTO users (username, email, password_hash, first_name, last_name, is_member, member_since, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [username, email, hashedPassword, firstName, lastName, false, null, 'user']
    );

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- LOGIN LOGIC (With Admin Override) ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; 
  
  try {
    // 1. MASTER ADMIN OVERRIDE
    // This allows the specific credentials to bypass standard hashing for quick admin access
    if (email === 'admin@gmail.com' && password === '123') {
      const adminResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const admin = adminResult.rows[0];

      // Generate token using existing ID or fallback
      const token = generateToken(admin ? admin.id : 999);

      return res.status(200).json({ 
        message: "Admin Login successful", 
        token: token, 
        user: { 
          id: admin ? admin.id : 999, 
          username: admin ? admin.username : 'admin_command',
          firstName: "Admin",
          lastName: "Command",
          email: "admin@gmail.com",
          role: 'admin', 
          is_member: true,
          profilePic: admin ? admin.profile_pic : null,
          member_since: admin ? admin.member_since : null
        } 
      });
    }

    // 2. STANDARD LOGIN LOGIC
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    
    // Check password against password_hash column
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.status(200).json({ 
      message: "Login successful", 
      token: token, 
      user: { 
        id: user.id, 
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role || 'user',
        profilePic: user.profile_pic,
        is_member: user.is_member,
        member_since: user.member_since,
        googleId: user.google_id 
      } 
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// --- GOOGLE LOGIN LOGIC ---
exports.googleLogin = async (req, res) => {
  const { 
    displayName = '', 
    email = '', 
    profilePic = '', 
    firstName = '', 
    lastName = '' 
  } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required for Google Login" });
  }

  const finalUsername = displayName || email.split('@')[0] || `user_${Date.now()}`;

  try {
    let userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let user;

    if (userResult.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users 
        (username, email, password_hash, profile_pic, first_name, last_name, is_member, google_id, role) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [finalUsername, email, 'google_auth', profilePic, firstName, lastName, false, 'google_linked', 'user']
      );
      user = newUser.rows[0];
    } else {
      const updatedUser = await pool.query(
        `UPDATE users SET 
        profile_pic = COALESCE(NULLIF($1, ''), profile_pic), 
        first_name = COALESCE(NULLIF(first_name, ''), $2), 
        last_name = COALESCE(NULLIF(last_name, ''), $3), 
        google_id = COALESCE(google_id, 'google_linked') 
        WHERE email = $4 RETURNING *`,
        [profilePic, firstName, lastName, email]
      );
      user = updatedUser.rows[0];
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: "Google Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email, 
        role: user.role || 'user',
        profilePic: user.profile_pic,
        is_member: user.is_member,
        member_since: user.member_since,
        googleId: user.google_id 
      }
    });
  } catch (err) {
    console.error("❌ Google Login Database Error:", err.message);
    res.status(500).json({ message: "Server error during Google Login", error: err.message });
  }
};

// --- ADDITIONAL ACCOUNT ACTIONS ---
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; 

  try {
    const userResult = await pool.query("SELECT password_hash, google_id FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];
    
    if (user.google_id) {
        return res.status(400).json({ message: "Google accounts do not use manual passwords" });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: "Current password incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashedNewPassword, userId]);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during password update" });
  }
};

exports.upgradeToMember = async (req, res) => {
  const userId = req.user.id; 
  try {
    const updatedUser = await pool.query(
      "UPDATE users SET is_member = true, member_since = $1 WHERE id = $2 RETURNING *",
      [new Date(), userId]
    );
    res.status(200).json({ message: "Welcome to Executive Membership!", user: updatedUser.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to process membership" });
  }
};

exports.cancelMembership = async (req, res) => {
  const userId = req.user.id;
  try {
    const updatedUser = await pool.query(
      "UPDATE users SET is_member = false, member_since = null WHERE id = $1 RETURNING *",
      [userId]
    );
    res.status(200).json({ message: "Membership cancelled successfully.", user: updatedUser.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel membership" });
  }
};