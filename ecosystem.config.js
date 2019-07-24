const { name } = require('./package.json');
module.exports = {
  apps: [
    {
      name,
      script: 'lib/server.js',
      instances: '1',
      env: {
        PORT: 5100,
      },
    },
  ],
};
