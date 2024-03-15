const users = [];

function joinUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// get currnetUser 
function getCurrentUser(id){
    return users.find(user=>users.id === id)
}


// when userLeaves
function leaveUser(id){
    const userIndex = users.findIndex(user=> user.id === id)

    if(userIndex !== -1){
        return users.splice(userIndex , 1)[0]
    }
}

// getting currentRoom users 

function roomUsers(room){
    return users.filter(user => user.room === room)
}



module.exports = {
    joinUser,
    getCurrentUser,
    leaveUser,
    roomUsers
}
