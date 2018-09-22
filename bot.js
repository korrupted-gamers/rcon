require('dotenv').config()
const Rcon = require('rcon');
const handler = require('./handler');


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
    }
}).on('response', str => {
    if (str) {
        let channel = discord.channels.find('id', config.discord.channel);
        channel.send(str)
            .then(message => console.log(message.content))
            .catch(console.error);
    }
}).on('end', () => {
    rcon.connect();
});


discord.login(config.discord.token);
