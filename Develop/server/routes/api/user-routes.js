const express = require('express');
const router = express.Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// Import middleware
const { authMiddleware } = require('../../utils/auth');

// Define routes
router.get('/', (req, res) => {
  res.send('GET users route');
});

router.post('/', (req, res) => {
  res.send('POST users route');
});

// Use authMiddleware where needed
router.post('/', createUser);
router.put('/', authMiddleware, saveBook);
router.post('/login', login);
router.get('/me', authMiddleware, getSingleUser);
router.delete('/books/:bookId', authMiddleware, deleteBook);

module.exports = router;
