import ReplyFrom from 'fastify-reply-from';
import { Server, ServerResponse, IncomingMessage } from 'http';
import fastify, { FastifyPlugin } from 'fastify';

import pushSchema from '../schemas/push-event.json';

// webhook of work wechat
const wwWebHook = {
  base: 'https://qyapi.weixin.qq.com',
  sendUrl: '/cgi-bin/webhook/send',
};

declare module 'fastify' {
  type HttpServer = Server;
  type HttpRequest = IncomingMessage;
  type HttpResponse = ServerResponse;

  type FastifyPlugin<T = {}> = fastify.Plugin<
    HttpServer,
    HttpRequest,
    HttpResponse,
    T
  >;
}

const routes: FastifyPlugin = (server, options, next) => {
  server.addSchema(pushSchema);

  server.register(ReplyFrom, {
    base: wwWebHook.base,
  });

  server.post('/api/gitlab/:botKey', (request, reply) => {
    const {
      params: { botKey },
      headers: { 'x-gitlab-event': event },
      body: {
        repository: { name, web_url: repoUrl },
        changes,
        object_attributes,
        user: { username },
      },
    } = request;
    const {
      target_branch,
      source_branch,
      title,
      work_in_progress,
      url: mrUrl,
      action,
    } = object_attributes;
    const { source, target, last_commit, ...restObj } = object_attributes;
    console.log('receive events', changes, restObj);

    switch (event) {
      case 'Merge Request Hook':
        {
          if (!work_in_progress) {
            const body = {
              msgtype: 'markdown',
              markdown: {
                content: [
                  `${username} ${action} MR [${title}](${mrUrl}) of repo [${name}](${repoUrl})`,
                  `> branch:  ${source_branch} => ${target_branch}`,
                ].join('\n'),
              },
            };
            reply.from(wwWebHook.sendUrl, {
              queryString: {
                key: botKey,
              },
              body,
            });
            return;
          }
        }
        break;
      default:
        break;
    }

    reply.code(400).send('Unkown event');
  });

  next();
};

export default routes;
