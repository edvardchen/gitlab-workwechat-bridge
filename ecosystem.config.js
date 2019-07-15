module.exports = {
  apps: [
    {
      name: 'gitlab-ww-bridge',
      script: 'lib/server.js',
      instances: '1',
      env: {
        PORT: 5100,
      },
    },
  ],
};
