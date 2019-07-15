import fastify from 'fastify';
import routes from './routes';

const server = fastify({
  logger: {
    prettyPrint: {
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    },
    base: null,
  },
});

server.register(routes);

const { PORT } = process.env;

server.listen(Number(PORT), '0.0.0.0', (err, address) => {
  if (err) throw err;
  console.info(`server listening on ${address}`);
});
