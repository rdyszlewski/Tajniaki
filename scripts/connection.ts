import {Client} from '../scripts/client'
// const Client = require("../scripts/client")

const HOST = "192.168.0.31";
const PORT = 7777;


var connectButton;
var infoText;
var messageInput;
var sendButton;
var gameButton;
var client;

window.onload = function(e){
    initElements();
    initListeners();
}

function initElements(){
    connectButton = document.getElementById("connect_button");
    infoText = document.getElementById("info_text");
    messageInput = document.getElementById("message_input");
    sendButton = document.getElementById("send_button");
    gameButton = document.getElementById("game_button");
}

function initListeners(){
    alert(connectButton)
    connectButton.onclick = function(){
        connectToServer(HOST, PORT);
    }

    sendButton.onclick = function(){
        var message = messageInput.value;
        client.write("PRINT:"+message)
        messageInput.value = "";
    }

    gameButton.onclick = function(){
        window.location.replace("gra.html");
    }
}

function connectToServer(ip, port){
    showConnectingState();
    client = new Client();
    client.connect(ip, port, showConnectedState);
}

function showConnectingState() {
    connectButton.style.display = "none"
    infoText.innerHTML = "Łączenie";
}

function showConnectedState(){
    infoText.innerHTML = "Połączono"
}
