/// <reference path="../headers/hapi/hapi.d.ts" />
import TemmeT from './modules/temmet';
import * as Hapi from 'hapi';

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
    method: 'GET',
    path:'/hello/{name}', 
    handler: (request, reply) => {
        return reply('hello ' + request.params['name']);
    }
});

server.route({
    method: 'GET',
    path:'/temmet/{code}', 
    handler: (request, reply) => {
        return reply(TemmeT(request.params['code']));
    }
});

server.start((err) => {
    if (err) { throw err; }
    console.log('Server running at:', server.info.uri);
});
