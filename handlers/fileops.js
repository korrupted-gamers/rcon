const fs = require('fs');
const {
  exec
} = require('child_process');
const path = require('path');
const os = require('os');
const rsync = require('rsyncwrapper')
const env = require('../environment')



// echo 'Some Text' | ssh user@remotehost "cat > /remotefile.txt"

const filePath = path.join(__dirname, '..', 'data', 'Admins.cfg');

// echo generated ssh key



var doServerFileSync = false;


// rate limit Admins.cfg file pushes
// @TODO this holds the cli process open!! make it function only for bot
// const fileSyncTimer = setInterval(() => {
//   if (doServerFileSync) {
//     console.log('SYNCING WITH SERVER')
//     module.exports.pushAdminsFile()
//     doServerFileSync = false;
//   }
// }, 30000);


module.exports = {

  // Add player to Admins file under the Spawner group
  addSpawner: (obj, args) => {
    let name = obj.message.name;
    let steamID = obj.message.steamID;

    if (typeof name === 'undefined' || typeof steamID === 'undefined') {
      return
    }


    // console.log(`name: [${name}], steamID: [${steamID}]`)


    fs.readFile(filePath, function(err, data) {
      if (err) throw err;
      if (data.indexOf(steamID) >= 0) {
        console.log(`SteamID ${steamID} (${name}) already exists in local cache. Skipping.`)
      } else {
        fs.appendFile(filePath, `Admin=${steamID}:Spawner // ${name}\n`, function(err) {
          if (err) throw err;
          console.log('Saved!');

          doServerFileSync = true;
        });
      }
    });



    //obj.rcon.send('AdminBroadcast ' + nickname + ': ' + args);
    //obj.adminFile.addSpawner
  },

  pushAdminsFile: (obj, args) => {
    rsync(
      {
        src: filePath,
        dest: `${env.sshUser}@${env.sshHost}:${env.remoteFilePath}`,
        ssh: true,
        recursive: false,
        deleteAll: false,
        privateKey: env.sshIdentityFile,
        args: ['--verbose']
      }
    , (err, code, cmd) => {
      console.log(`err=${err}, code=${code}, cmd=${cmd}`)
      if (err) throw err;
    })
  },

  pullAdminsFile: (obj, args) => {
    console.log(`pulling file ${env.sshUser}@${env.sshHost}:${env.remoteFilePath} to ${filePath}`)
    rsync(
        {
          dest: filePath,
          src: `${env.sshUser}@${env.sshHost}:${env.remoteFilePath}`,
          ssh: true,
          recursive: false,
          deleteAll: false,
          privateKey: env.sshIdentityFile,
          args: ['--verbose']
        }
      , (err, code, cmd) => {
        console.log(`err=${err}, code=${code}, cmd=${cmd}`)
        if (err) throw err;
      }
    )
  },

  isSSHKeyPresent: (cb) => {
    return fs.fileExistsSync(env.sshIdentityFile);
  },

  writePubkey: () => {
    console.log(`writing ${env.sshPubkeyData} to ${env.sshIdentityPubFile}`)
    fs.writeFileSync(env.sshIdentityPubFile, env.sshPubkeyData);
    fs.chmodSync(path.join(env.sshIdentityFile, '..'), 0o700)
    fs.chmodSync(env.sshIdentityPubFile, 0o600)
    console.log(fs.statSync(path.join(env.sshIdentityPubFile, '..')))
    console.log(fs.statSync(env.sshIdentityPubFile))
    console.log(fs.readFileSync(env.sshIdentityPubFile, 'utf8'));
  },

  writePrivkey: () => {
    fs.writeFileSync(env.sshIdentityFile, env.sshPrivkeyData);
    fs.chmodSync(path.join(env.sshIdentityFile, '..'), 0o700)
    fs.chmodSync(env.sshIdentityFile, 0o600)
    console.log(fs.readFileSync(env.sshIdentityFile, 'utf8'));

  },

  generateKnownHostsFile: () => {
    fs.appendFileSync(path.join(os.homedir(), '.ssh', 'known_hosts'), env.serverKeyData);
  }

};
