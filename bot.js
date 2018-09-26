require('dotenv').config()
const Rcon = require('rcon');
//const handler = require('./handler');


const rcon = new Rcon(
    process.env.RCON_HOST,
    process.env.RCON_PORT,
    process.env.RCON_PASSWORD,
    {
      "tcp": true,
      "challenge": false
    }
);

let authenticated = false;
rcon.on('auth', () => {
    if (!authenticated) {
        authenticated = true;
        console.log('Authenticated!');
        var buffer = "ListPlayers";
        rcon.send(buffer);
        buffer = "";
    }

}).on('response', str => {
    if (str) {
        console.log(`>> response: ${str}`)
        // let channel = discord.channels.find('id', config.discord.channel);
        // channel.send(str)
        //     .then(message => console.log(message.content))
        //     .catch(console.error);
    }
}).on('end', () => {
    rcon.connect();
    console.log('endo')
});

rcon.connect();
