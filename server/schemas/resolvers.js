const { User } = require('./models');
const axios = require('axios');
require('dotenv').config();


const resolvers = {
  Query: {
    searchBooks: async (_, { query }) => {
      const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: query,
            key: GOOGLE_BOOKS_API_KEY,
          },
        });
    
        const books = response.data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
        }));
    
        return books;
      } catch (error) {
        console.error('Error searching for books:', error);
        throw new Error('Failed to search for books');
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const newUser = await User.create({ username, email, password });
        return newUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    },
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }
     
      const isValidPassword = await user.isCorrectPassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign({ email: user.email, id: user._id }, 'your_secret_key', { expiresIn: '1h' });

      return { token, user };
    },
    saveBook: async (_, { book }, { user }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      // Implement saving book logic here
    },
    removeBook: async (_, { bookId }, { user }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      // Implement removing book logic here
    },
  },
};

module.exports = { resolvers };
