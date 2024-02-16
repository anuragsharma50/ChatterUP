const socket = io.connect("http://localhost:8500");

socket.on('connection',()=> {
    console.log("Connected to the server");
})

// username = "ZIN";
let username = prompt("Please enter your name");
console.log(username);

const chatsElement = document.getElementById("chats");
const input = document.getElementById("input-msg");
const sendButton = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing");
const onlineUsers = document.getElementById("users");

socket.emit('join',username);

socket.on('load_msg',(messages) => {
    messages.forEach(message => {
        let div = document.createElement('div');
        div.className = "one-chat";
        div.innerHTML = `
            <span class="username">${message.username}</span> <span class="time">3:04PM</span>
            <div class="msg">${message.msg}</div>`
        chatsElement.appendChild(div);
    });
})

sendButton.addEventListener('click', () => {
    let msg = input.value;

    console.log(msg);

    if(msg) {
        socket.emit('new_msg',msg);
        let div = document.createElement('div');
        div.className = "my-one-chat";
        div.innerHTML = `
            <span class="username">${username}</span> <span class="time">3:04PM</span>
            <div class="msg">${msg}</div>`;
        chatsElement.appendChild(div);
    }

    input.value = "";
})

socket.on('new_user', newUserMsg => {
    let div = document.createElement('div');
    div.className = "welcome";
    div.innerText = `${newUserMsg}`
    chatsElement.appendChild(div);
})

socket.on('broadcast_msg', data => {
    let div = document.createElement('div');
    div.className = "one-chat";
    div.innerHTML = `
            <span class="username">${message.username}</span> <span class="time">3:04PM</span>
            <div class="msg">${message.msg}</div>`
    chatsElement.appendChild(div);
});

socket.on("online_users",users => {
    console.log(users);
    users.forEach(user => {
        const li = document.createElement("li");
        li.innerText = user;
        onlineUsers.appendChild(li);
    })
})

socket.on("someone_typing",username => {
    typingIndicator.innerText = `${username} is typing...`;
})

socket.on("someone_stopped_typing",() => {
    typingIndicator.innerText = "";
})

input.addEventListener('focus',() => {
    console.log("typing...");
    socket.emit("typing",username);
})

input.addEventListener('focusout',() => {
    console.log("stopped typing...");
    socket.emit("stopped_typing",username);
});

