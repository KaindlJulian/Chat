const io = require('socket.io-client');
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiUEFTU1dPUkQiOiIkMmEkMTAkb2VSRW0yQ2t1Z2dhRHhOL0w5dEEvdThPWS5ZaWVWeTJuNUVnM2JuejJzQXpxZU00S1BtY3EiLCJ1c2VybmFtZSI6IkpvaG4ifSwiaWF0IjoxNTE2MTQwMTMyLCJleHAiOjE1MTY3NDQ5MzJ9.ERKA_SWhprE3p5LV5Q5cpo7N2pe9_-zRucqPgusOewU"
const socket = io.connect('ws://localhost:3000', {
  'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }
});

  // Connection succeeded
  socket.on('success', (data) => {
    console.log(data);
  });
