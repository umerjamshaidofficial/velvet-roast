const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../config/db'); 
const { protect } = require('../middleware/authMiddleware');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

/**
 * GET: Helper to check if a user exists before sending gift
 */
router.get('/check-recipient', protect, async (req, res) => {
    const { email } = req.query;
    try {
        const userCheck = await db.query('SELECT id, first_name FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.json({ 
                exists: true, 
                user: userCheck.rows[0],
                message: "User found in Sanctuary." 
            });
        }
        res.json({ exists: false, message: "User not found." });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

/**
 * POST: Trigger email or DB entry
 */
router.post('/send-ritual', protect, async (req, res) => {
    const { recipientEmail, message, items, orderId } = req.body;
    const senderName = req.user.first_name || 'A fellow Member'; 

    try {
        // 1. Check if recipient exists in the Sanctuary
        const userCheck = await db.query('SELECT id FROM users WHERE email = $1', [recipientEmail]);
        
        if (userCheck.rows.length > 0) {
            const recipientId = userCheck.rows[0].id;

            // User exists: Create a record in received_rituals directly
            await db.query(
                `INSERT INTO received_rituals (sender_id, recipient_id, order_id, gift_message, items) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [req.user.id, recipientId, orderId || null, message, JSON.stringify(items || [])]
            );

            return res.status(200).json({ 
                internal: true, 
                message: "Ritual assigned directly to recipient's Sanctuary." 
            });
        }

        // 2. If user DOES NOT exist, save to pending_gifts and send invitation
        await db.query(
            'INSERT INTO pending_gifts (sender_id, recipient_email, gift_message) VALUES ($1, $2, $3)',
            [req.user.id, recipientEmail, message]
        );

        // Define the Redirect URL for Automatic Association
        const claimUrl = `http://localhost:5173/login?redirect=received-rituals&email=${recipientEmail}`;

        const mailOptions = {
            from: '"Velvet Roast Rituals" <rituals@velvetroast.com>',
            to: recipientEmail,
            subject: `${senderName} shared a Sacred Ritual with you ☕`,
            html: `
                <div style="background-color: #FDFCF8; padding: 60px 20px; font-family: 'Playfair Display', serif; color: #3E2723; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #D4AF37; padding: 50px; border-radius: 24px; box-shadow: 0 10px 30px rgba(62, 39, 35, 0.05);">
                        
                        <div style="margin-bottom: 40px;">
                            <h2 style="font-size: 10px; letter-spacing: 0.5em; text-transform: uppercase; color: #D4AF37; margin: 0;">The Sanctuary</h2>
                            <h1 style="font-size: 32px; font-weight: normal; margin: 10px 0; color: #3E2723;">A Gift Awaits</h1>
                        </div>

                        <p style="font-size: 16px; line-height: 1.6; color: #3E2723; margin-bottom: 30px;">
                            A fellow Member, <strong>${senderName}</strong>, wants to share a curated coffee experience with you.
                        </p>
                        
                        <div style="border-top: 1px dashed #D4AF37; border-bottom: 1px dashed #D4AF37; padding: 30px 20px; margin: 30px 0; background-color: #FDFCF8;">
                            <p style="font-style: italic; font-size: 18px; margin: 0; color: #5D4037;">
                                "${message}"
                            </p>
                        </div>
                        
                        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 25px; color: #3E2723; opacity: 0.6;">
                            Enter the Sanctuary to uncover your ritual
                        </p>
                        
                        <a href="${claimUrl}" style="display: inline-block; background-color: #3E2723; color: #FDFCF8; padding: 18px 45px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; transition: all 0.3s ease;">
                            Claim Your Ritual
                        </a>

                        <div style="margin-top: 50px; border-top: 1px solid #F0EBE3; pt: 30px;">
                             <p style="font-size: 9px; color: #BCB8B1; text-transform: uppercase; letter-spacing: 1px;">
                                Velvet Roast &copy; 2026 — Curated with intention.
                             </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ internal: false, message: "Ritual invitation sent!" });

    } catch (err) {
        console.error("Transmission Error:", err);
        res.status(500).json({ error: "Failed to transmit ritual." });
    }
});

module.exports = router;