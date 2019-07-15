declare module 'fastify-reply-from' {
  function fastifyReplyFrom(): void;

  namespace fastifyReplyFrom {
    interface ReplyFromOptions {
      base: string;
    }
  }

  export = fastifyReplyFrom;

  import fastify, { FastifyRequest } from 'fastify';
  import { IncomingHttpHeaders, IncomingMessage } from 'http';
  module 'fastify' {
    interface FastifyReply<HttpResponse> {
      from(
        source: string,
        opts: {
          queryString?: { [key: string]: unknown };
          contentType?: string;
          onResponse?: (
            request: FastifyRequest,
            reply: FastifyReply<HttpResponse>,
            res: any
          ) => void;

          body: any;
          // rewriteHeaders?: (headers: => Headers;

          rewriteRequestHeaders?: (
            req: IncomingMessage,
            Headers: IncomingHttpHeaders
          ) => IncomingHttpHeaders;
        }
      ): void;
    }
  }
}
