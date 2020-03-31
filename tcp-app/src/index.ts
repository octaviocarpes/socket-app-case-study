const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 4000;


const convert2Bytes = (data: string): number => {
    return encodeURI(data).split(/%..|./).length - 1;
}

io.on('connection', socket => {
    console.log('User connected with socket!', socket.id);

    socket.on('upload', response => {
        console.log('Uploaded File recieved', response);

        socket.emit('upload-response', { 'Name': 'Upload Response', 'Response': `Your message has ${convert2Bytes(response.Data)} bytes`})
    });
});

server.listen(PORT, () => {
    console.log(`User service listening on port: ${PORT}`);
});

// deixar claro que usou uma maquina e so pode mandar mensagem
