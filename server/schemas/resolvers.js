

const resolvers = {
    Query: {
        hello: () => {
            return "Hi There I am a Strng Dataset"
        }
    },

    Mutation: {
     //   addUser: (parent, args, context) => {  // --> think of args as the INCOMING req.body object
        addUser: (parent, { username, email, password }, context) => {
            console.log("Arguments: ", args);
            // Here we are in our endpoint with the data (args) and we just talk with the Database
            User.create(username, email, password)
                .then(data => {
                    console.log("data: ", data);

                })
                .catch()
        }
    }
}


module.exports = resolvers;