module.exports = {

    AdminBroadcast: (obj, args) => {
        let message = obj.message;
        if (typeof message === 'undefined') message = ''

        obj.rcon.send('AdminBroadcast ' + message);
    }
};
