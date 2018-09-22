/*!
 * node-rcon - examples/stdio.js
 * Copyright(c) 2012 Justin Li <j-li.net>
 * MIT Licensed
 */

/*
 * This example reads commands from stdin and sends them on enter key press
 * You need to manually `npm install keypress` for this example to work
 */

require('dotenv').config()
var Rcon = require('rcon');

var conn = new Rcon(
  process.env.RCON_HOST,
  process.env.RCON_PORT,
  process.env.RCON_PASSWORD,
  { "tcp": true, "challenge": false }
);

conn.on('auth', function() {
  console.log("Authed!");

}).on('response', function(str) {
  console.log("Got response: " + str);

}).on('end', function() {
  console.log("Socket closed!");
  process.exit();

});

conn.connect();


require('keypress')(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

var buffer = "";

process.stdin.on('keypress', function(chunk, key) {
  if (key && key.ctrl && (key.name == 'c' || key.name == 'd')) {
    conn.disconnect();
    return;
  }
  process.stdout.write(chunk);
  if (key && (key.name == 'enter' || key.name == 'return')) {
    conn.send(buffer);
    buffer = "";
    process.stdout.write("\n");
  } else if (key && key.name == 'backspace') {
    buffer = buffer.slice(0, -1);
    process.stdout.write("\033[K"); // Clear to end of line
  } else {
    buffer += chunk;
  }

});
