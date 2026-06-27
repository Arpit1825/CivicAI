const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { chatAssistant } = require('../controllers/assistantController');

router.post('/chat', auth, chatAssistant);

module.exports = router;
