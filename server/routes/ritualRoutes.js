const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET: All Rituals (for FullMenu and RitualList)
router.get('/', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM rituals ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Specific Ritual + Related
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const productResult = await db.query("SELECT * FROM rituals WHERE id = $1", [id]);
    if (productResult.rows.length === 0) return res.status(404).json({ error: "Ritual not found" });

    const product = productResult.rows[0];
    const relatedResult = await db.query(
      "SELECT * FROM rituals WHERE preference = $1 AND id != $2 AND visibility != 'hidden' LIMIT 4",
      [product.preference, id]
    );

    res.json({ product, related: relatedResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update Ritual Details (Used by the Save button in RitualList.jsx)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, visibility, preference } = req.body;
  try {
    const result = await db.query(
      "UPDATE rituals SET name = $1, price = $2, visibility = $3, preference = $4 WHERE id = $5 RETURNING *",
      [name, price, visibility, preference, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Toggle Visibility (Used by the Hide/Show eye icon in RitualList.jsx)
router.patch('/:id/visibility', async (req, res) => {
  const { id } = req.params;
  const { visibility } = req.body;
  try {
    const result = await db.query(
      "UPDATE rituals SET visibility = $1 WHERE id = $2 RETURNING *",
      [visibility, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove Ritual (Used by the Trash icon in RitualList.jsx)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM rituals WHERE id = $1", [id]);
    res.json({ message: "Ritual deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;