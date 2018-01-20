const io = require('socket.io-client');
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJuYW1lIjoiYXNkZiIsImVtYWlsIjoiYXNkZmZAZ214LmF0IiwiUEFTU1dPUkQiOiIkMmEkMTAkVGhDYVdYVTRwRFVWWTUxMnFTR1NVLi5adjFpN3FBaGtiL041NTJMc0pkWlA0ZTFTdmVaamkiLCJ1c2VybmFtZSI6ImFzZGYiLCJzdGF0dXMiOiJvZmZsaW5lIiwibGFzdFNlZW4iOiIyMDE4LTAxLTE4VDA5OjAwOjA0LjAwMFoifSwiaWF0IjoxNTE2NDU1MTMwLCJleHAiOjE1MTcwNTk5MzB9.NoXxtfpt_Q761JJwfmb6Aa9NFSZxFSSpWdapsuRVRiw"
const socket = io.connect('ws://localhost:3000', {
  'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }
});

  // Connection succeeded
  socket.on('success', (data) => {
    console.log(data.users);
    console.log(data.groups);
  });

  socket.on('getUsers', (data) =>{
      console.log(data);
  })
