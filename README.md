# Squad Discord Admin
RCON administration for your Squad server via Discord.

# Commands
- !bot help `{Command (optional)}`
- !bot clear
- !match broadcast `{Message}`
- !match restart 
- !match end
- !map list 
- !map change `{MapName}`
- !map next `{MapName}`
- !player list 
- !player ban `{Name, SteamId, or PlayerId}` `{BanLength}` `{Reason}`
- !player kick `{Name, SteamId, or PlayerId}` `{Reason}`
- !player swap `{Name, SteamId, or PlayerId}`

# Installation

This bot is written to run on top of node.js. Please see https://nodejs.org/en/download/

Once you have node installed running `npm install` from the bot directory should install all the needed packages. If this command prints errors the bot won't work!

# Running
Before first run you will need to create an `config.json` file and fill in the required info. An example is provided for you in this repository. A bot [token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) is necessary to run the bot. When adding the bot to your discord server, I recommend giving it access to a single channel that only your admins have access to.  This will prevent other users from running administrative commands on your server.

To start the bot just run
`node bot.js`.

# Updates
If you update the bot, please run `npm update` before starting it again. If you have
issues with this, you can try deleting your node_modules folder and then running
`npm install` again.


## .env file

Environment vars must be set for RCON to successfully connect with your Squad server. Here's an example .env file.

```
RCON_HOST=192.168.10.200
RCON_PORT=21114
RCON_PASSWORD=rosebud123
```
