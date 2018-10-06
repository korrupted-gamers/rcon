require('dotenv').config()
const path = require('path')

const sshHost = module.exports.sshHost = process.env.SSH_HOST;
const sshPort = module.exports.sshPort = process.env.SSH_PORT;
const sshUser = module.exports.sshUser = process.env.SSH_USER;
const remoteFilePath = module.exports.remoteFilePath = process.env.REMOTE_ADMINS_FILEPATH;
const sshPrivkeyData = module.exports.sshPrivkeyData = process.env.SSH_PRIVATE_KEY;
const sshPubkeyData = module.exports.sshPubkeyData = process.env.SSH_PUBLIC_KEY;
const serverKeyData = module.exports.serverKeyData = process.env.SERVER_KEY_DATA;
const sshIdentityFile = module.exports.sshIdentityFile = path.join(__dirname, 'data', 'ssh', 'id_rsa');
const sshIdentityPubFile = module.exports.sshIdentityPubFile = path.join(__dirname, 'data', 'ssh', 'id_rsa.pub');
const rconHost = module.exports.rconHost = process.env.RCON_HOST;
const rconPort = module.exports.rconPort = process.env.RCON_PORT;
const rconPassword = module.exports.rconPassword = process.env.RCON_PASSWORD;

if (typeof sshUser === 'undefined') throw new Error('SSH_USER must be defined in env')
if (typeof sshHost === 'undefined') throw new Error('SSH_HOST must be defined in env')
if (typeof sshPort === 'undefined') throw new Error('SSH_PORT must be defined in env')
if (typeof remoteFilePath === 'undefined') throw new Error('REMOTE_ADMINS_FILEPATH must be defined in env')
if (typeof sshPrivkeyData === 'undefined') throw new Error('SSH_PRIVATE_KEY must be defined in env.')
if (typeof sshPubkeyData === 'undefined') throw new Error('SSH_PUBLIC_KEY must be defined in env.')
if (typeof serverKeyData === 'undefined') throw new Error('SERVER_KEY_DATA must be undefined in env.')
if (typeof rconHost === 'undefined') throw new Error('RCON_HOST must be defined in env!')
if (typeof rconPort === 'undefined') throw new Error('RCON_PORT must be defined in env!')
if (typeof rconPassword === 'undefined') throw new Error('RCON_PASSWORD must be defined in env!')
