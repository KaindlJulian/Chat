const io = require('socket.io-client');
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20iLCJpZCI6MSwibGFzdFNlZW4iOiIyMDE4LTAxLTIyVDEyOjIxOjE4LjAwMFoiLCJuYW1lIjoiSm9obiBEb2UiLCJQQVNTV09SRCI6IiQyYSQxMCRsUnRPMFowSkl6VUtCZm1MTzNTNlR1UnFmQnd1YmJTNjguNkVPRTZldzNsUzlQQWtyNGRQRyIsInN0YXR1cyI6bnVsbCwidXNlcm5hbWUiOiJKb2huIn0sImlhdCI6MTUxNjYyMzY5OSwiZXhwIjoxNTE3MjI4NDk5fQ.4N8S7jNQ8TBCiU8s1b4MhC3Pc_rS9lQPExxfDnPLSqU"
const socket = io.connect('ws://localhost:3000', {
  'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }
});

socket.on('success', (data) => {
  let getUsers = data.users;
  let getGroups = data.groups;
  console.log(data.users);
  console.log(data.groups);
  console.log(data.msgs);
  socket.emit('addUser', {user: getUsers[1], group : getGroups[0]});
  socket.on('UserConnectedRoom', data => {
    console.log(data);
  })
  //socket.emit('sendMessage', {msg:"Hello with Boolean", group: data.groups[0]})
});

socket.on('getUsers', (data) =>{
    console.log(data);
})



  