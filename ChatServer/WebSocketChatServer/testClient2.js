const io = require('socket.io-client');
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRmYXNkZkBnbWFpbC5jb20iLCJpZCI6MiwibGFzdFNlZW4iOiIyMDE4LTAxLTIyVDE1OjAxOjAxLjAwMFoiLCJuYW1lIjoiYWRzZiIsIlBBU1NXT1JEIjoiJDJhJDEwJGhjZEUyV3ViNmhlOS54dnVnOGJFWS53VVA0bi9wc3Y1VmdGVFViMkFzNzlrLk5RbDlyNlFxIiwic3RhdHVzIjpudWxsLCJ1c2VybmFtZSI6ImRmZiJ9LCJpYXQiOjE1MTY2MzMyNzEsImV4cCI6MTUxNzIzODA3MX0.9DyF3nG7RZnm2UBefgyvVYJUG0cS0QxC_EtOGergfGQ"
const socket = io.connect('ws://localhost:3000', {
  'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }
});

  // Connection succeeded
  socket.on('success', (data) => {
    //console.log(data.users);
    console.log(data.groups);
    //console.log(data.msgs);
    //socket.emit('leaveRoom', {group : data.groups[0]})
  });

  socket.on('getUsers', (data) =>{
      console.log(data);
  })
  socket.on('groupJoin', data => console.log(data))
  socket.on('newGroup', data => console.log(data))
  socket.on('receiveMessage', data => console.log(data));
