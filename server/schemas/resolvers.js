const { User } = require('./models');

const resolvers = {
  Query: {
    getUser: async (_, __, { user }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      return user;
    },
    searchBooks: async (_, { query }) => {
     
      const books = [
        { id: 1, title: 'Book 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', author: 'Author 2' },
        { id: 3, title: 'Book 3', author: 'Author 3' },
      ];
      return books;
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
    },
    removeBook: async (_, { bookId }, { user }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
    
    },
  },
};

module.exports = { resolvers };
