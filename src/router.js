const router = require("express").Router();
const messageController = require("./controllers/message.controller");

router.get("//contacts", messageController.findContacts);
router.get("//:userId", messageController.findWith);
router.post("/", messageController.sendTo);

module.exports = router;
