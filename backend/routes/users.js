const express = require("express");
const router = express.Router();
const db = require("../db");
const { body, param, validationResult } = require("express-validator");

// Helpers
function handleDbError(res, err) {
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}

// GET /users - all users
router.get("/", (req, res) => {
  db.all("SELECT * FROM users ORDER BY id DESC", [], (err, rows) => {
    if (err) return handleDbError(res, err);
    res.json(rows);
  });
});

// GET /users/:id - single user
router.get(
  "/:id",
  param("id").isInt().withMessage("Invalid id"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = Number(req.params.id);
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) return handleDbError(res, err);
      if (!row) return res.status(404).json({ error: "User not found" });
      res.json(row);
    });
  }
);

// POST /users - create user
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").optional().trim(),
    body("company").optional().trim(),
    body("address.street").optional().trim(),
    body("address.city").optional().trim(),
    body("address.zip").optional().trim(),
    body("address.geo.lat").optional().isFloat().withMessage("lat must be a number"),
    body("address.geo.lng").optional().isFloat().withMessage("lng must be a number")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      name,
      email,
      phone,
      company,
      address = {}
    } = req.body;

    const street = address.street || "";
    const city = address.city || "";
    const zip = address.zip || "";
    const lat = address.geo && address.geo.lat ? address.geo.lat : null;
    const lng = address.geo && address.geo.lng ? address.geo.lng : null;

    const sql = `INSERT INTO users
      (name, email, phone, company, address_street, address_city, address_zip, geo_lat, geo_lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [name, email, phone, company, street, city, zip, lat, lng], function (err) {
      if (err) {
        if (err.message && err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "Email already exists" });
        }
        return handleDbError(res, err);
      }
      const newId = this.lastID;
      db.get("SELECT * FROM users WHERE id = ?", [newId], (err2, row) => {
        if (err2) return handleDbError(res, err2);
        res.status(201).json(row);
      });
    });
  }
);

// PUT /users/:id - update
router.put(
  "/:id",
  [
    param("id").isInt(),
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Email must be valid"),
    body("phone").optional().trim(),
    body("company").optional().trim(),
    body("address.street").optional().trim(),
    body("address.city").optional().trim(),
    body("address.zip").optional().trim(),
    body("address.geo.lat").optional().isFloat(),
    body("address.geo.lng").optional().isFloat()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = Number(req.params.id);

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, existing) => {
      if (err) return handleDbError(res, err);
      if (!existing) return res.status(404).json({ error: "User not found" });

      const {
        name = existing.name,
        email = existing.email,
        phone = existing.phone,
        company = existing.company,
        address = {}
      } = req.body;

      const street = address.street !== undefined ? address.street : existing.address_street;
      const city = address.city !== undefined ? address.city : existing.address_city;
      const zip = address.zip !== undefined ? address.zip : existing.address_zip;
      const lat = address.geo && address.geo.lat !== undefined ? address.geo.lat : existing.geo_lat;
      const lng = address.geo && address.geo.lng !== undefined ? address.geo.lng : existing.geo_lng;

      const sql = `UPDATE users SET
        name = ?, email = ?, phone = ?, company = ?,
        address_street = ?, address_city = ?, address_zip = ?, geo_lat = ?, geo_lng = ?
        WHERE id = ?`;

      db.run(sql, [name, email, phone, company, street, city, zip, lat, lng, id], function (err2) {
        if (err2) {
          if (err2.message && err2.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({ error: "Email already exists" });
          }
          return handleDbError(res, err2);
        }
        db.get("SELECT * FROM users WHERE id = ?", [id], (err3, row) => {
          if (err3) return handleDbError(res, err3);
          res.json(row);
        });
      });
    });
  }
);

// DELETE /users/:id
router.delete("/:id", param("id").isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const id = Number(req.params.id);

  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return handleDbError(res, err);
    if (!row) return res.status(404).json({ error: "User not found" });

    db.run("DELETE FROM users WHERE id = ?", [id], function (err2) {
      if (err2) return handleDbError(res, err2);
      res.json({ success: true });
    });
  });
});

module.exports = router;
