import { Injectable } from '@angular/core';
import { Client } from './shared/client';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private _connection:Client;

  public  connect(host, port, on_connected_event){
    this._connection = new Client();
    this._connection.setOnConnectedEvent(()=>{
      console.log("Otworzenie połączenia");
    });
    this._connection.setOnCloseEvent(()=>{
      console.log("Zamknięcie połączenia");
    })
    this._connection.connect(host, port, on_connected_event);
  }

  public send(message, path){
    this._connection.write(message, path);
  }

  public subscribe(path, method){
    console.log(path);
    this._connection.getSocket().subscribe(path, method, {id: path});
  }

  public unsubscribe(path){
    this._connection.getSocket().unsubscribe(path);
  }

  public isConnected():boolean{
    if(this._connection != undefined){
      return this._connection.isConnected();
    }
    return false;
  }

  public setOnCloseEvent(event){
    this._connection.setOnCloseEvent(event);
  }
}
