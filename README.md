Overview
--------

simple-deploy.js is a front-end deployment tool based on rsync and node.js.

Prerequisites
-------------

* rsync
* ssh authorized

Installation
------------

```
npm install simple-deploy --dev
```

Usage
-----

Create a file **deploy.js** and include the follow code within it:

```
const SimpleDeploy = require('simple-deploy');

const firstServer = new SimpleDeploy({
  username: 'web',
  host: 'Your remote server ip address',
  localPath: 'dist',
  remotePath: '/home/first/project/dist',
});
const secondServer = new SimpleDeploy({
  username: 'web',
  host: 'Your remote server ip address',
  localPath: 'dist',
  remotePath: '/home/second/project/dist',
});

async function deploy() {
  try {
    await SimpleDeploy.shell('npm run lint');
    await SimpleDeploy.shell('npm run test');
    await SimpleDeploy.shell('npm run build');
    await firstServer.sync();
    await secondServer.sync();
    console.log('Deploy success');
  } catch (err) {
    console.log('deploy failed');
  }
}

deploy();
```

Then, run `node deploy.js` to deploy project.

Apis
----

- `SimpleDeploy.shell('npm run test')` exec local shell command.
- `instance.remote('pwd')` exec remote server shell command.
- `instance.sync('-ravz')` sync localPath content with remote server, the arguments is rsync flags and the default flags is `-avI`



Contributing
-------------

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
