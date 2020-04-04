const udp = require('dgram');
const buffer = require('buffer');
const app = require('express')(udp);
const bodyParser = require('body-parser');
const cors = require('cors');

const convert2Bytes = (data: string): number => {
    return encodeURI(data).split(/%..|./).length - 1;
};

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());


// creating a client socket


app.post('/', (req, res) => {
    let response = '';
    const client = udp.createSocket('udp4');

    client.send(req.body.message,2222,'localhost',function(error){
        if(error){
          client.close();
        }else{
          console.log('Data sent !!!');
        }
    });

    client.on('message',function(msg,info){
        console.log('Data received from server : ' + msg.toString());
        console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
        console.log(msg.toString());''
        response = msg.toString();
    });

    setTimeout(() => {
        client.close();
        res.status(200).send(`Your message has ${convert2Bytes(response)} bytes`);
    }, 500);
});

app.get('/', (req, res) => {
    res.send('alive');
});

app.listen(5000, () => {
    console.log('Proxy up on port 5000');
});
