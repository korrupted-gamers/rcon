const fs = require('fs');
const { exec } = require('child_process');
const sshHost = process.env.SSH_HOST;
const sshPort = process.env.SSH_PORT;
const sshIdentity = process.env.SSH_IDENTITY;
const sshUser = process.env.SSH_USER;
const remoteFilePath = process.env.REMOTE_ADMINS_FILEPATH



if (typeof sshUser === 'undefined') throw new Error('SSH_USER must be defined in env')
if (typeof sshHost === 'undefined') throw new Error('SSH_HOST must be defined in env')
if (typeof sshPort === 'undefined') throw new Error('SSH_PORT must be defined in env')
if (typeof remoteFilePath === 'undefined') throw new Error('REMOTE_ADMINS_FILEPATH must be defined in env')
if (typeof sshIdentity === 'undefined') throw new Error('SSH_IDENTITY must be defined in env')


	
// echo 'Some Text' | ssh user@remotehost "cat > /remotefile.txt"

filePath = 'Admins.test.cfg';




var doServerFileSync = false;


const fileSyncTimer = setInterval(() => {
	if (doServerFileSync) {
		console.log('SYNCING WITH SERVER')
		exec(`cat ${filePath} | ssh ${sshUser}@${sshHost} -p ${sshPort} -i ${sshIdentity} "cat >> ${remoteFilePath}"`, (err, stdout, stderr) => {
			if (err) throw err;
			console.log(stdout);
			doServerFileSync = false;
		})
	}
}, 10000);


module.exports = {

    addSpawner: (obj, args) => {
        let name = obj.message.name;
		let steamID = obj.message.steamID;
		
		console.log(`name: [${name}], steamID: [${steamID}]`)
		
		fs.readFile(filePath, function (err, data) {
			if (err) throw err;
			if (data.indexOf(steamID) >= 0){
				console.log(`SteamID ${steamID} (${name}) already exists in local cache. Skipping.`)
			}
			else {
				fs.appendFile(filePath, `Admin=${steamID}:Spawner // ${name}\n`, function (err) {
					if (err) throw err;
					console.log('Saved!');
					
					doServerFileSync = true;
				});
			}
		});
		


        //obj.rcon.send('AdminBroadcast ' + nickname + ': ' + args);
		//obj.adminFile.addSpawner
    },

    restart: (obj, args) => {
        obj.rcon.send('AdminRestartMatch');
    },

    end: (obj, args) => {
        obj.rcon.send('AdminEndMatch');
    }

};
