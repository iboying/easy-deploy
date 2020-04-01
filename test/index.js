const Deploy = require('../dist/easy-deploy.js')

const deploy = new Deploy({
  username: 'user',
  host: '127.0.0.1',
  localPath: 'dist/*',
  remotePath: '/mnt/www/test'
})

deploy.sync()

Deploy.shell('git rev-parse head').then((data) => {
  console.log(data)
})
