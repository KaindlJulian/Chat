const io = require('socket.io-client');
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiUEFTU1dPUkQiOiIkMmEkMTAkb2VSRW0yQ2t1Z2dhRHhOL0w5dEEvdThPWS5ZaWVWeTJuNUVnM2JuejJzQXpxZU00S1BtY3EiLCJ1c2VybmFtZSI6IkpvaG4iLCJzdGF0dXMiOiJvZmZsaW5lIiwibGFzdFNlZW4iOiIwMDAwLTAwLTAwIDAwOjAwOjAwIn0sImlhdCI6MTUxNjE5MDU3MSwiZXhwIjoxNTE2Nzk1MzcxfQ.XIm5odr0Gyyyued8pM7_-tOoS-GfLbpK8MkQ2CRtCWU"
const socket = io.connect('ws://localhost:3000', {
  'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }
});

socket.on('success', (data) => {
  console.log(data.users);
  console.log(data.groups);
});

socket.on('getUsers', (data) =>{
    console.log(data);
})



  