import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

export class Client {
  private connected;
  private socket;
  private onConnectedEvent;
  private onCloseEvent;

  constructor() {}

  public connect(host, port, on_connected) {
    var path = 'http://' + host + ':' + port + '/tajniaki';
    var socket = new SockJS(path);
    this.socket = Stomp.over(socket);
    this.onConnectedEvent = on_connected;
    this.socket.connect(
      {},
      () => this.onConnect(),
      () => this.onDisconnect()
    );
  }

  private onConnect() {
    this.connected = true;
    if (this.onConnectedEvent != null) {
      this.onConnectedEvent();
    }
  }

  private onDisconnect() {
    this.connected = false;
    if (this.onCloseEvent != null) {
      this.onCloseEvent();
    }
  }

  public setOnConnectedEvent(event) {
    this.onConnectedEvent = event;
  }

  public setOnCloseEvent(event) {
    this.onCloseEvent = event;
  }

  write(message, path) {
    this.socket.send(path, {}, message);
  }

  public getSocket() {
    return this.socket;
  }

  public isConnected() {
    return this.connected;
  }
}
