const { exec } = require('child_process')
const chalk = require('chalk')

export default class EasyDeploy {
  constructor (options) {
    const { username, host, localPath, remotePath, port } = options
    if (!(username && host && localPath && remotePath)) {
      throw new Error("The params must has 'host、username、remotePath、localPath' variables and optional variable 'port'.")
    }

    this.username = username
    this.host = host
    this.localPath = localPath
    this.remotePath = remotePath
    this.port = port || 22
  }

  static shell (script) {
    return new Promise((resolve, reject) => {
      let task = exec(script)
      task.stdout.on('data', (data) => {
        console.log(chalk.blue(data.toString()))
      })
      task.stderr.on('data', (data) => {
        console.log(chalk.red(data.toString()))
      })
      task.on('exit', (code) => {
        task = null
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Process exited with code ${code}`))
        }
      })
    })
  }

  remote (script) {
    const { username, host, port } = this
    const remoteScript = `ssh -p ${port} ${username}@${host} ${script}`
    return EasyDeploy.shell(remoteScript)
  }

  sync (flags = '-avI') {
    const { username, host, port, localPath, remotePath } = this
    const script = `rsync ${flags} -r -e 'ssh -p ${port}' ${localPath} ${username}@${host}:${remotePath}`
    return EasyDeploy.shell(script)
  }
}
