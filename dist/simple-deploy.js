/**
 * simple-deploy.js v0.1.0
 * (c) 2019 iboying(weboying@gmail.com)
 * @license MIT
 */
'use strict';

var ref = require('child_process');
var spawn = ref.spawn;

var SimpleDeploy = function SimpleDeploy (options) {
  var username = options.username;
  var host = options.host;
  var localPath = options.localPath;
  var remotePath = options.remotePath;
  var port = options.port;
  if (!(username && host && localPath && remotePath)) {
    throw new Error("The params must has 'host、username、remotePath、localPath' variables and optional variable 'port'.")
  }

  this.username = username;
  this.host = host;
  this.localPath = localPath;
  this.remotePath = remotePath;
  this.port = port || 22;
};

SimpleDeploy.shell = function shell (script) {
  var array = script.trim().replace(/\s{2,}/g, ' ').split(' ');
  var task = spawn(array[0], array.splice(1));
  return new Promise(function (resolve, reject) {
    task.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    task.stderr.on('data', function (data) {
      console.log(data.toString());
    });
    task.on('close', function (code) {
      if (code !== 0) {
        var error = new Error(("Process exited with code " + code));
        reject(error);
      } else {
        resolve();
      }
    });
  })
};

SimpleDeploy.prototype.remote = function remote (script) {
  var ref = this;
    var username = ref.username;
    var host = ref.host;
    var port = ref.port;
  var remoteScript = "ssh -p " + port + " " + username + "@" + host + " " + script;
  return SimpleDeploy.shell(remoteScript)
};

SimpleDeploy.prototype.sync = function sync (flags) {
    if ( flags === void 0 ) flags = '-avI';

  var ref = this;
    var username = ref.username;
    var host = ref.host;
    var port = ref.port;
    var localPath = ref.localPath;
    var remotePath = ref.remotePath;
  var script = "rsync " + flags + " -r --delete --port=" + port + " " + localPath + " " + username + "@" + host + ":" + remotePath;
  return SimpleDeploy.shell(script)
};

module.exports = SimpleDeploy;
