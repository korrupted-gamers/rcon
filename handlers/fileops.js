const fs = require('fs');
const {
  exec
} = require('child_process');
const path = require('path');
const Rsync = require('rsync');
const sshpk = require('sshpk');

const sshHost = process.env.SSH_HOST;
const sshPort = process.env.SSH_PORT;
const sshUser = process.env.SSH_USER;
const sshIdentity = path.join(__dirname, '..', 'data', 'ssh', 'id_rsa.pub');
const remoteFilePath = process.env.REMOTE_ADMINS_FILEPATH;



if (typeof sshUser === 'undefined') throw new Error('SSH_USER must be defined in env')
if (typeof sshHost === 'undefined') throw new Error('SSH_HOST must be defined in env')
if (typeof sshPort === 'undefined') throw new Error('SSH_PORT must be defined in env')
if (typeof remoteFilePath === 'undefined') throw new Error('REMOTE_ADMINS_FILEPATH must be defined in env')



// echo 'Some Text' | ssh user@remotehost "cat > /remotefile.txt"

const filePath = path.join(__dirname, '..', 'data', 'Admins.cfg');


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
    var rsync = new Rsync()
      .shell(`ssh -p ${sshPort} -i ${sshIdentity}`)
      .source(`${filePath}`)
      .destination(`${sshUser}@${sshHost}:${remoteFilePath}`)

    rsync.execute((err, code, cmd) => {
      if (err) throw err;
    })
  },

  pullAdminsFile: (obj, args) => {
    console.log('pulling file')
    var rsync = new Rsync()
      .shell(`ssh -p ${sshPort} -i ${sshIdentity}`)
      .source(`${sshUser}@${sshHost}:${remoteFilePath}`)
      .destination(`${filePath}`)

    rsync.execute((err, code, cmd) => {
      console.log(cmd)
      if (err) throw err;
    })
  },

  isSSHKeyPresent: () => {
    return fs.fileExistsSync(sshIdentity)
  }

};
