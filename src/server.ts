/// <reference path="../headers/hapi/hapi.d.ts" />
import * as Hapi from 'hapi';

import TemmeT from './modules/temmet';
let temmet_response: string;
let temp1: string;

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
    method: 'GET',
    path:'/temmet/{code}', 
    handler: (request, reply) => {
        try {
            temp1 = request.params['code'];
            console.log(temp1);
            temmet_response = TemmeT(temp1);
            console.log('Response: ' + temmet_response);
            return reply(temmet_response);
        } catch (e) {
            console.log('Encountered an error');
            return reply("Temmet throw an error!").code(400);
        }
    }
});

server.start((err) => {
    if (err) { throw err; }
    console.log('Server running at:', server.info.uri);
});
