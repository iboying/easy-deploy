const { spawn } = require('child_process')

export default class SimpleDeploy {
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
    const array = script.trim().replace(/\s{2,}/g, ' ').split(' ')
    const task = spawn(array[0], array.splice(1))
    return new Promise((resolve, reject) => {
      task.stdout.on('data', (data) => {
        console.log(data.toString())
      })
      task.stderr.on('data', (data) => {
        console.log(data.toString())
      })
      task.on('close', (code) => {
        if (code !== 0) {
          const error = new Error(`Process exited with code ${code}`)
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  remote (script) {
    const { username, host, port } = this
    const remoteScript = `ssh -p ${port} ${username}@${host} ${script}`
    return SimpleDeploy.shell(remoteScript)
  }

  sync (flags = '-avI') {
    const { username, host, port, localPath, remotePath } = this
    const script = `rsync ${flags} -r --delete --port=${port} ${localPath} ${username}@${host}:${remotePath}`
    return SimpleDeploy.shell(script)
  }
}
