import React, { useState, MouseEvent } from 'react';
import axios from 'axios';
import './App.css';
import style from 'styled-components';

const Container = style.div`

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border: 1px solid;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 10% 90%;

`;

const Header = style.header`

  position: relative;
  left: 50%;
  transform: translate(-50%);
  width: 80%;
  height: 100%;

  title {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      margin: 0;
      margin-top: 20px;
    }
  }

`;

const UploadContainer = style.div`

  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100%;

  div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    form {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      button {
        width: 200px;
        height: 75px;
        color: white;
        background: black;
        padding: 10px;
        font-size: 16px;
        font-weight: bold;

        &:hover {
          cursor-pointer;
        }
      }
    }
  }
`;

const App = () => {
  const TCP_HOST = 'http://localhost:4000';
  const UDP_HOST = 'http://localhost:5000';
  const [tcp, setTcp] = useState('');
  const [tcpResponse, setTcpResponse] = useState('');
  const [udp, setUdp] = useState('');
  const [udpResponse, setUdpResponse] = useState('');

  const connectWithTCP = (event: MouseEvent): void => {
    event.preventDefault();
    const socket = require('socket.io-client');
    const io = socket(TCP_HOST);
    io.on('connect', () => {
      setTcp(`TCP Connected, Uploading file with TCP server.`);
      const TcpFile: HTMLElement = document.getElementById('tcp-input')!;
      TcpFile.click();
      TcpFile.onchange = (file: any) => {
        io.emit('upload', { 'Name': 'File', 'Data': file.target.value})
      };
    });

    io.on('upload-response', (data: any) => {
      setTcpResponse(data.Response);
    });
  };

  const connectWithUDP = (event: MouseEvent): void => {
    event.preventDefault();
    setUdp(`Udp Connected, Uploading file with TCP server.`);
    const UdpFile: HTMLElement = document.getElementById('udp-input')!;
    UdpFile.click();
    UdpFile.onchange = (file: any) => {
      axios.post(UDP_HOST, {
        message: file.target.value
      })
      .then(response => {
        setUdpResponse(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    };
  };

  return (
    <div className="App">
      <Container>
        <Header>
          <title>
            <h1>Tarefa 2 - Laboratorio de redes</h1>
          </title>
        </Header>
        <UploadContainer>
            <div>
              <form>
                <p>{tcp}</p>
                <button onClick={(event: MouseEvent) => connectWithTCP(event)}>Upload com TCP</button>
                <input type='file' id='tcp-input'/>
                <p>{tcpResponse}</p>
              </form>
            </div>
            <div>
              <form>
                <p>{udp}</p>
                <button onClick={(event: MouseEvent) => connectWithUDP(event)}>Upload com UDP</button>
                <input type='file' id='udp-input'/>
                <p>{udpResponse}</p>
              </form>
            </div>
        </UploadContainer>
      </Container>
    </div>
  );
};

export default App;
