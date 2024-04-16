const express = require('express');
const router = express.Router();
const {
  createUser,
  getMe,
  saveBook,
  deleteBook,
  loginUser,
} = require('../../controllers/user-controller');

const { authMiddleware } = require('../../utils/auth');

router.get('/me', authMiddleware, getMe);

router.post('/', createUser);

router.post('/login', loginUser);

router.put('/books', authMiddleware, saveBook); // Updated endpoint

router.delete('/books/:bookId', authMiddleware, deleteBook);

module.exports = router;
