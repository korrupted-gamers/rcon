require('dotenv').config()
//const nedb = require('nedb'); // @todo ???
const Rcon = require('rcon');
const handler = require('./handler');




// generate SSH keys if they don't already exist
if (!handler.ssh.isKeysReady()) {
  handler.ssh.generateKeys();
  console.log(' ***************************************')
  console.log(' ***** Please restart to continue! *****')
  console.log(' ***** Please restart to continue! *****')
  console.log(' ***** Please restart to continue! *****')
  console.log(' ***************************************')
} else {
  // pull the admins file when the program starts (skip if ssh was just created)
  handler.fileops.pullAdminsFile();

  const rcon = new Rcon(
    process.env.RCON_HOST,
    process.env.RCON_PORT,
    process.env.RCON_PASSWORD, {
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
            message: `Welcome ${name}! Next round you will have access to AdminCreateVehicle!`,
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
}
