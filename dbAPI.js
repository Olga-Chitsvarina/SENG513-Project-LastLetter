module.exports = {

    /**
     * Register new users in the DB
     */
    registerUser: function(admin, socket, user) {

        // Query DB for user by email
        const ref = admin.firestore().collection('users').doc(user.email);
        ref.get().then(function(doc) {

            // User is not yet registered
            if(!doc.exists) {

                // Register user
                admin.firestore().collection('users').doc(user.email).set({
                    email: user.email,      // Email = Key
                    name: user.displayName, // Username
                    singleHighScore: 0,     // Single player high score
                    multiHighScore: 0,      // Multi player high score
                    chatColor: '#000000',   // Chat message color
                    imageLink: null,        // User profile image URL
                    gameInProgress: false,  // Is the user in a game right now?
                    savedGame: null         // Previously saved single player game
                })
                    // Success: redirect to home page
                    .then(function() { return true; })

                    // Error
                    .catch(function(error) { console.error('Error: ', error); return false; });
            }
        });
    },

    /**
     * Get a user from the DB
     */
    getUser: function(admin, socket, user) {

        // Get reference to user in DB and fetch data
        const ref = admin.firestore().collection('users').doc(user.email);
        ref.get()

            // Success: Send user data
            // .then(function(doc) { socket.emit('get user', doc.data()); })
            .then(function(doc) { return doc.data(); })

            // Error
            .catch(function(error) { console.error("Error: ", error); return null; });
    },

    /**
     * Change a user's name in the DB
     */
    changeUserName: function(admin, user, newName, socket) {

        // Get reference to user in DB and update it
        const ref = admin.firestore().collection('users').doc(user.email);
        let data = {
            email: user.email,                      // Email = Key
            name: newName,                          // New username
            singleHighScore: user.singleHighScore,  // Single player high score
            multiHighScore: user.multiHighScore,    // Multi player high score
            chatColor: user.chatColor,              // Chat message color
            imageLink: user.imageLink,              // User profile image URL
            gameInProgress: user.gameInProgress,    // Is the user in a game right now?
            savedGame: user.savedGame               // Previously saved single player game
        };
        ref.set(data)

            // Success
            //.then(function () { socket.emit('new name', newName); })
            .then(function () { return true; })

            // Error
            .catch(function(error) { console.error('Error: ', error); return false; });
    },

    /**
     * Get the top 10 players by single player high score from the DB
     */
    getLeaderboard: function(admin) {

        // Get top 10 user scores from DB
        admin.firestore().collection('users')
            .orderBy('singleHighScore', 'desc')
            .limit(10)
            .get()

            // Success: Send each leaderboard entry to the client
            .then(function(querySnapshot) { return querySnapshot; })

            // Error
            .catch(function(error) { console.error("Error: ", error) });
    }
};