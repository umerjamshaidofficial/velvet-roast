const db = require('../config/db');

// @desc    Get all orders placed BY the logged in user (Including Sent Gifts)
// @route   GET /api/orders
exports.getMyOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.*, 
                COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = $1 
            GROUP BY o.id
            ORDER BY o.created_at DESC;
        `;
        
        const result = await db.query(query, [req.user.id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetch Orders Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Create new order with recipient-specific Gift Ritual support & Auto-Address Saving
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
    const { customer, items, total, isGift, giftMessage, recipientEmail, addressId } = req.body;
    
    try {
        await db.query('BEGIN');
        
        let finalAddressId = addressId;

        if (!finalAddressId) {
            const addrQuery = `
                INSERT INTO user_addresses (user_id, label, full_name, street_address, city, postal_code)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `;
            const addrValues = [
                req.user.id,
                'Recent Delivery', 
                `${customer.firstName} ${customer.lastName}`,
                customer.address,
                customer.city,
                customer.postalCode
            ];
            const addrResult = await db.query(addrQuery, addrValues);
            finalAddressId = addrResult.rows[0].id;
        }

        const orderQuery = `
            INSERT INTO orders (
                user_id, address_id, first_name, last_name, address, city, 
                postal_code, total_amount, is_gift, gift_message, recipient_email, is_claimed
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id;
        `;
        
        const numericTotal = typeof total === 'string' ? parseFloat(total.replace('$', '')) : total;

        const orderValues = [
            req.user.id,
            finalAddressId,
            customer.firstName, 
            customer.lastName, 
            customer.address, 
            customer.city, 
            customer.postalCode, 
            numericTotal,
            isGift || false,
            isGift ? giftMessage : null,
            isGift ? recipientEmail : null,
            false 
        ];
        
        const orderResult = await db.query(orderQuery, orderValues);
        const orderId = orderResult.rows[0].id;

        const itemQuery = `
            INSERT INTO order_items (order_id, product_name, quantity, price, image_url) 
            VALUES ($1, $2, $3, $4, $5);
        `;

        for (const item of items) {
            const numericPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
            await db.query(itemQuery, [
                orderId, 
                item.name, 
                item.quantity, 
                numericPrice, 
                item.image
            ]);
        }
        
        await db.query('COMMIT');
        
        res.status(201).json({ 
            success: true, 
            orderId: `VR-${orderId}`,
            message: isGift ? "Gift Ritual dedicated successfully" : "Order placed successfully"
        });

    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Create Order Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Get rituals dedicated TO the user (Receiver side)
// @route   GET /api/orders/received
exports.getReceivedGifts = async (req, res) => {
    try {
        // Updated to use req.user.email for automatic association upon login
        const query = `
            SELECT 
                o.id, o.gift_message as personal_note, o.created_at, o.is_claimed, o.gratitude_sent,
                u.username as sender_name, u.profile_pic as sender_photo,
                COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.recipient_email = $1 AND o.is_gift = TRUE
            GROUP BY o.id, u.id
            ORDER BY o.created_at DESC;
        `;
        
        const result = await db.query(query, [req.user.email]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetch Received Gifts Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch received rituals' });
    }
};

// @desc    Get count of UNCLAIMED received rituals for Navbar badge
// @route   GET /api/orders/received/count
exports.getReceivedGiftCount = async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) FROM orders 
            WHERE recipient_email = $1 AND is_gift = TRUE AND is_claimed = FALSE;
        `;
        
        const result = await db.query(query, [req.user.email]);
        res.status(200).json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Count Gifts Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Mark a gift ritual as claimed/opened
// @route   PUT /api/orders/received/:id/claim
exports.claimGift = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query(
            'UPDATE orders SET is_claimed = TRUE WHERE id = $1 AND recipient_email = $2 RETURNING *',
            [id, req.user.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ritual not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Ritual claimed" });
    } catch (error) {
        console.error('Claim Gift Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Send gratitude message back to the sender
// @route   POST /api/orders/thank/:id
exports.sendGratitude = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const result = await db.query(
            `UPDATE orders 
             SET gratitude_message = $1, gratitude_sent = TRUE, notification_read = FALSE 
             WHERE id = $2 AND recipient_email = $3 
             RETURNING user_id`,
            [message, id, req.user.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Gift record not found" });
        }

        res.status(200).json({ success: true, message: "Gratitude shared" });
    } catch (error) {
        console.error('Gratitude Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Get count of unread thank-you notifications for the sender
// @route   GET /api/orders/notifications/unread
exports.getUnreadNotifications = async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) FROM orders 
            WHERE user_id = $1 AND gratitude_sent = TRUE AND notification_read = FALSE;
        `;
        
        const result = await db.query(query, [req.user.id]);
        res.status(200).json({ unreadCount: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Notification Count Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Get the list of gratitude messages WITH sender info
// @route   GET /api/orders/notifications/list-detailed
exports.getNotificationList = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id, 
                o.gratitude_message, 
                o.created_at,
                u.username AS sender_name,
                u.profile_pic AS sender_photo
            FROM orders o
            JOIN users u ON o.recipient_email = u.email
            WHERE o.user_id = $1 AND o.gratitude_sent = TRUE
            ORDER BY o.created_at DESC;
        `;

        const result = await db.query(query, [req.user.id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetch Notification List Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Mark notifications as read
// @route   PUT /api/orders/notifications/read-all
exports.markNotificationsRead = async (req, res) => {
    try {
        await db.query(
            "UPDATE orders SET notification_read = TRUE WHERE user_id = $1",
            [req.user.id]
        );
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mark Read Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};