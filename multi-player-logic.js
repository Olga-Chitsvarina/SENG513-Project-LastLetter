module.exports = {

    //==================================================================================================================
    // VARIABLES USED BY MULTIPLAYER

    socketsWaitingForOpponentCities: new Map(),
    socketsWaitingForOpponentCountries : new Map(),

    //=================================================================================================================
    // RETURN CORRESPONDING LIST

    returnCorrespondingCategoryList: function(categoryStr){
        if (categoryStr === "cities"){
            return this.socketsWaitingForOpponentCities;
        }
        else{
            return this.socketsWaitingForOpponentCountries;
        }
    },

    //=================================================================================================================
    // ADD/REMOVE USERS FROM  THE LIST

    addSocketToWaitList: function(socket, user, correspondingCategoryList){
        correspondingCategoryList.set(socket, user);
    },

    removeSocketFromWaitList: function(socket){
       this.socketsWaitingForOpponentCountries.delete(socket);
       this.socketsWaitingForOpponentCities.delete(socket);
        console.log("User was removed from the wait list");
    },

    //=================================================================================================================
    // RETURN PLAYERS IF POSSIBLE OR ADD ME TO THE LIST:

    addMeToTheListOrGiveAPlayer: function(socket, user, categoryStr){
        console.log("my user is:" + user);
        let mapUserToSocket = new Map();

        let correspondingCategoryList = this.returnCorrespondingCategoryList(categoryStr);

        this.addSocketToWaitList(socket, user, correspondingCategoryList);

        let keysList = correspondingCategoryList.entries();
        console.log(keysList);
            if (keysList.length > 1){
                console.log("got here");
                let socket1 = keysList[0];
                let socket2 = keysList[1];

                let user1 = correspondingCategoryList.get(socket1);
                let user2 = correspondingCategoryList.get(socket2);

                this.removeSocketFromWaitList(socket1);
                this.removeSocketFromWaitList(socket2);

                mapUserToSocket.set(user1,socket1);
                mapUserToSocket.set(user2,socket2);

                return mapUserToSocket;
            }
        return mapUserToSocket;

    }
};
