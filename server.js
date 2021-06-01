const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;


app.use(express.static(`${__dirname}/public`));

app.route("/")
	.get((req, res) => {
		res.sendFile(`${__dirname}/public/index.html`);
	});

io.on('connection', (socket) => {
		
	socket.on('user', (user) => {
		socket.emit('new user', {message: `${user} has entered the chat`});
	});


	socket.on('message', (data) => {
		socket.broadcast.emit("new message", data);
	});
});

http.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});