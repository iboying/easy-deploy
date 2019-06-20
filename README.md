Overview
--------

**easy-deploy.js** is a front-end deployment tool based on rsync and node.js.

Prerequisites
-------------

* rsync
* ssh authorized

Installation
------------

```
npm install @iboying/easy-deploy --dev
```

Usage
-----

Create a file **deploy.js** and include the follow code within it:

```javascript
const EasyDeploy = require('@iboying/easy-deploy');

const firstServer = new EasyDeploy({
  username: 'web',
  host: 'Your remote server ip address',
  localPath: 'dist/',
  port: 1234,
  remotePath: '/home/first/project/dist',
});
const secondServer = new EasyDeploy({
  username: 'web',
  host: 'Your remote server ip address',
  localPath: 'dist/',
  remotePath: '/home/second/project/dist',
});

async function deploy() {
  try {
    await EasyDeploy.shell('npm run lint');
    await EasyDeploy.shell('npm run test');
    await EasyDeploy.shell('npm run build');
    await firstServer.sync();
    await secondServer.sync();
    console.log('Deploy success');
  } catch (err) {
    console.log('Deploy failed');
  }
}

deploy();
```

Then, run `node deploy.js` to deploy project.

Apis
----

- `EasyDeploy.shell('npm run test')` exec local shell command.
- `instance.remote('pwd')` exec remote server shell command.
- `instance.sync('-ravz')` sync localPath content with remote server, the arguments is rsync flags and the default flags is `-avI`

Contributing
-------------

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
