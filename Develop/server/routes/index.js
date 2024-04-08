const express = require('express');
const path = require('path');

const router = express.Router();

// serve up react front-end in production
router.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

module.exports = router;
