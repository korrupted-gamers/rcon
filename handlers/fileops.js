const fs = require('fs');
const {
  exec
} = require('child_process');
const path = require('path');
const rsync = require('rsyncwrapper')

const sshHost = process.env.SSH_HOST;
const sshPort = process.env.SSH_PORT;
const sshUser = process.env.SSH_USER;
const sshIdentityFile = path.join(__dirname, '..', 'data', 'ssh', 'id_rsa');
const sshIdentityPubFile = path.join(__dirname, '..', 'data', 'ssh', 'id_rsa.pub');
const remoteFilePath = process.env.REMOTE_ADMINS_FILEPATH;
const sshPrivkeyData = process.env.SSH_PRIVATE_KEY;
const sshPubkeyData = process.env.SSH_PUBLIC_KEY;


if (typeof sshUser === 'undefined') throw new Error('SSH_USER must be defined in env')
if (typeof sshHost === 'undefined') throw new Error('SSH_HOST must be defined in env')
if (typeof sshPort === 'undefined') throw new Error('SSH_PORT must be defined in env')
if (typeof remoteFilePath === 'undefined') throw new Error('REMOTE_ADMINS_FILEPATH must be defined in env')
if (typeof sshPrivkeyData === 'undefined') throw new Error('SSH_PRIVATE_KEY must be defined in env.')
if (typeof sshPubkeyData === 'undefined') throw new Error('SSH_PUBLIC_KEY must be defined in env.')


// echo 'Some Text' | ssh user@remotehost "cat > /remotefile.txt"

const filePath = path.join(__dirname, '..', 'data', 'Admins.cfg');
console.log(filePath)

// echo generated ssh key



var doServerFileSync = false;


// rate limit Admins.cfg file pushes
const fileSyncTimer = setInterval(() => {
  if (doServerFileSync) {
    console.log('SYNCING WITH SERVER')
    pushAdminsFile()
    doServerFileSync = false;
  }
}, 30000);


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
        dest: `${sshUser}@${sshHost}:${remoteFilePath}`,
        ssh: true,
        recursive: false,
        deleteAll: false,
        privateKey: sshIdentityFile
      }
    , (err, code, cmd) => {
      if (err) throw err;
    })
  },

  pullAdminsFile: (obj, args) => {
    console.log('pulling file')
    rsync(
        {
          dest: filePath,
          src: `${sshUser}@${sshHost}:${remoteFilePath}`,
          ssh: true,
          recursive: false,
          deleteAll: false,
          privateKey: sshIdentityFile
        }
      , (err, code, cmd) => {
        if (err) throw err;
      }
    )
  },

  isSSHKeyPresent: (cb) => {
    return fs.fileExistsSync(sshIdentityFile);
  },

  writePubkey: () => {
    fs.chmodSync(path.join(sshIdentityFile, '..'), 0700)
    fs.chmodSync(sshIdentityPubFile, 0600)
    fs.writeFileSync(sshIdentityPubFile, sshPubkeyData);
    console.log(fs.statSync(path.join(sshIdentityFile, '..')))
    console.log(fs.statSync(sshIdentityFile))
  },

  writePrivkey: () => {
    fs.chmodSync(path.join(sshIdentityFile, '..'), 0700)
    fs.chmodSync(sshIdentityPubFile, 0600)
    fs.writeFileSync(sshIdentityFile, sshPrivkeyData);
  }

};
