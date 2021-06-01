(((d, io) => {

	//Variables
	
	const socket = io();
	const chat = d.getElementById('chat');
	const chatForm = d.getElementById('chat-form');
	const chatMessage = d.getElementById('message-text');
	const submit = d.getElementById('submit');
	let username;
	
	//Username logic

	d.addEventListener('DOMContentLoaded', () => {
		const modal = d.createElement('section');
		modal.setAttribute('class', 'username-modal');
		modal.setAttribute('id', 'username-modal');
		modal.innerHTML = `
			<h1>Username</h1>
			<form class="chat-form">
				<input type="text" name="username" class="chat-form__input" id="username">
				<button class="chat-form__button" id="username-btn">></button>
			</form>
		`;
		d.body.appendChild(modal);
	});

	d.addEventListener('click', (e) => {
		e.preventDefault();

		if (e.target.id === 'username-btn') {
			const modal = d.getElementById('username-modal');

			username = d.getElementById('username').value;

			socket.emit('user', username);

			d.body.removeChild(modal);
		}
	});

	//New user logic

	socket.on('new user', (data) => {
		const li = d.createElement("li");
		li.setAttribute("class", "chat__new-user");
		li.innerHTML = `
			<span class="chat__new-user__message">${data.message}</span>
		`;

    	chat.appendChild(li);
	});

	//Typing advice logic

	chatMessage.addEventListener('input', () => {
		socket.emit('typing', username);
	});

	socket.on('user typing', (data) => {
		const lis = d.querySelector(".chat__typing");
		const li = d.createElement("li");
		li.setAttribute("class", "chat__typing");
		li.innerHTML = `
			<span class="chat__typing__user">${data.message}</span>
		`;

		if (lis) {
			chat.removeChild(lis);
		}

		chat.insertAdjacentElement('beforeend', li);
	})

	//Chat logic

	submit.addEventListener('click', (e) => {
		e.preventDefault();

		const typing = d.querySelector('.chat__typing');
		const li = d.createElement('li');
		li.setAttribute('class', 'chat__message');
		li.innerHTML = `
			<span class="chat__message__author">${username}:</span>
			<p class="chat__message__msg">${chatMessage.value}</p>
		`;

		if (typing) {
			chat.removeChild(typing);
			// chat.insertBefore(li, typing);
			console.log('toy aentro')
		}

		chat.appendChild(li);
		
		socket.emit('message', {user: username, msg: chatMessage.value});
		
		chatMessage.value = '';
	});

	socket.on('new message', ({user, msg}) => {
		const typing = d.querySelector(".chat__typing");
		const li = d.createElement("li");
		li.setAttribute("class", "chat__message");
		li.innerHTML = `
			<span class="chat__message__author">${user}:</span>
			<p class="chat__message__msg">${msg}</p>
		`;

		if (typing) {
			chat.removeChild(typing);
			// chat.insertBefore(li, typing);
			console.log('toy aentro')
		}

		chat.appendChild(li);
	});
	
})(document, io))