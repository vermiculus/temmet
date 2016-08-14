deps:
	npm install typings -g
	typings install dt~hapi --save --global
	npm install hapi@13.0.0 --save --global
	npm install node-dev --save --global
src/server.js:
	tsc src/server.js
server: src/server.js
	node-dev src/server.js
compile:
	tsc -w src/server.ts
