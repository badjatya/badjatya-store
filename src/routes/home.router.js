const router = require("express").Router();

router.get("/", (req, res) => res.render("home"));
router.get("/social", (req, res) => res.render("social"));

module.exports = router;
