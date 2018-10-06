module.exports = {

    addSpawner: (obj, args) => {
        let name = obj.message.name;
	    let steamID = obj.message.steamID;

        obj.rcon.send('AdminBroadcast ' + nickname + ': ' + args);
    },

    restart: (obj, args) => {
        obj.rcon.send('AdminRestartMatch');
    },

    end: (obj, args) => {
        obj.rcon.send('AdminEndMatch');
    }

};
