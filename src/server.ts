/// <reference path="../headers/hapi/hapi.d.ts" />
import * as Hapi from 'hapi';

import * as temmet from './modules/temmet';

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
    method: 'GET',
    path:'/temmet/expand/{code}', 
    handler: (request, reply) => {
        try {
            return reply(temmet.Expand(request.params['code']));
        } catch (e) {
            console.log('Encountered an error');
            return reply("Temmet throw an error!").code(400);
        }
    }
});

server.route({
    method: 'GET',
    path:'/temmet/constants/{const}', 
    handler: (request, reply) => {
        switch (request.params['const']) {
        case "cursor-flag":
            return reply(temmet.CURSOR_HERE)
        }
        return reply("Not Found").code(400);
    }
});

server.start((err) => {
    if (err) { throw err; }
    console.log('Server running at:', server.info.uri);
});
