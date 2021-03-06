//const nedb = require('nedb'); // @todo ???
const Rcon = require('rcon');
const handler = require('./handlers');
const env = require('./env')



// generate SSH keys
handler.fileops.writePubkey();
handler.fileops.writePrivkey();
handler.fileops.generateKnownHostsFile();
// pull the admins file when the program starts (skip if ssh was just created)
handler.fileops.pullAdminsFile();

const rcon = new Rcon(
  env.rconHost,
  env.rconPort,
  env.rconPassword, {
    "tcp": true,
    "challenge": false
  }
);

let authenticated = false;
rcon.on('auth', () => {
  if (!authenticated) {
    authenticated = true;
    console.log('Authenticated!');
    const mainTimer = setInterval(() => {
      var buffer = "ListPlayers";
      rcon.send(buffer);
      buffer = "";
    }, 10000);
  }

}).on('response', str => {
  if (str) {
    console.log(`>> response: ${str}`)

    if (str.indexOf('----- Active Players -----') !== -1) {
      console.log('activ players found in response');

      const usersRegex = /ID: (\d+) \| SteamID: (.+) \| Name: (.+)\n/g;


      var match = usersRegex.exec(str);
      while (match !== null) {
        console.log(match)
        console.log(`MATCHO:::::: ${match[1]}, ${match[2]}, ${match[3]}`)

        handler.fileops.addSpawner({
          message: {
            name: match[3],
            steamID: match[2]
          },
          rcon
        });

        handler.commands.AdminBroadcast({
          message: `Welcome ${match[3]}! Next round you will have access to AdminCreateVehicle!`,
          rcon
        })

        match = usersRegex.exec(str);

      }


    }

  }
}).on('end', () => {
  rcon.connect();
  console.log('endo')
});

rcon.connect();
