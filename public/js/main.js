
const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

const socket = io()

const {username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})

// users joining particular room
socket.emit('joinRoom' , {username , room})




// showing room users
socket.on('roomUsers' , ({room, users})=>{
    outputRoomName(room);
    outputUsers(users)
})


// getting chat messages
socket.on('message',(message)=>{
    console.log(message);
    outputMessage(message)

    chatMessage.scrollTop = chatMessage.scrollHeight
})


chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const message = document.getElementById('msg')
    const messageText = message.value
    socket.emit('chat-message' ,(messageText))

    message.value = ""
    message.focus()
})


// displaying messages in chatbox 

function outputMessage(message){
    let div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML  = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div)

}


// displaying room name

function outputRoomName(room){
    roomName.innerText = room
}

// displaying users
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user =>`<li> ${user.username}</li>`).join('')}

    `
}