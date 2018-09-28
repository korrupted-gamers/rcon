const fs = require('fs');
const os = require('os');
const path = require('path');
const sshIdentity = process.env.SSH_IDENTITY;
const keygen = require('ssh-keygen');
const pubKeyPath = path.join(__dirname, '..', 'data', 'ssh', 'id_rsa.pub');
const privKeyPath = path.join(__dirname, '..', 'data', 'ssh', 'id_rsa');


module.exports = {

  // Add player to Admins file under the Spawner group
  generateKeys: (obj, args) => {

    fs.mkdirSync(path.dirname(pubKeyPath));
    fs.chmod(path.dirname(pubKeyPath), 0600, (err) => {
      if (err) throw err;

      var opts = {
        location: privKeyPath,
        comment: 'rconbot'
      };

      console.log(`Generating SSH keys at ${privKeyPath}...`)
      keygen(opts, function(err, keypair) {
        if (err) throw err;
        console.log('===============================');
        console.log('SSH keys have been generated. Add the public key to the Squad server so rconbot can connect to it.')
        console.log(keypair.pubKey);
        console.log('===============================');
      });

    })



  },

  isKeysReady: () => {
    return fs.existsSync(pubKeyPath);
  },

  getPubKeyPath: () => {
    return pubKeyPath;
  }
}
