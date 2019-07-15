/**
 * easy-deploy.js v0.3.0
 * (c) 2019 iboying(weboying@gmail.com)
 * @license MIT
 */
var ref = require('child_process');
var exec = ref.exec;
var chalk = require('chalk');

var EasyDeploy = function EasyDeploy (options) {
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

EasyDeploy.shell = function shell (script) {
  return new Promise(function (resolve, reject) {
    var task = exec(script);
    task.stdout.on('data', function (data) {
      console.log(chalk.blue(data.toString()));
    });
    task.stderr.on('data', function (data) {
      console.log(chalk.red(data.toString()));
    });
    task.on('exit', function (code) {
      task = null;
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(("Process exited with code " + code)));
      }
    });
  })
};

EasyDeploy.prototype.remote = function remote (script) {
  var ref = this;
    var username = ref.username;
    var host = ref.host;
    var port = ref.port;
  var remoteScript = "ssh -p " + port + " " + username + "@" + host + " " + script;
  return EasyDeploy.shell(remoteScript)
};

EasyDeploy.prototype.sync = function sync (flags) {
    if ( flags === void 0 ) flags = '-avI';

  var ref = this;
    var username = ref.username;
    var host = ref.host;
    var port = ref.port;
    var localPath = ref.localPath;
    var remotePath = ref.remotePath;
  var script = "rsync " + flags + " -r -e 'ssh -p " + port + "' " + localPath + " " + username + "@" + host + ":" + remotePath;
  return EasyDeploy.shell(script)
};

export default EasyDeploy;
