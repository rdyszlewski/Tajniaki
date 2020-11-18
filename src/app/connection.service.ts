import { Injectable } from '@angular/core';
import { Client } from './shared/client';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private static _connection:Client;

  public static connect(host, port, on_connected_event){
    this._connection = new Client();
    this._connection.setOnConnectedEvent(()=>{
      console.log("Otworzenie połączenia");
    });
    this._connection.setOnCloseEvent(()=>{
      console.log("Zamknięcie połączenia");
    })
    this._connection.connect(host, port, on_connected_event);
  }

  public static send(message, path){
    this._connection.write(message, path);
  }

  public static subscribe(path, method){
    console.log(path);
    this._connection.getSocket().subscribe(path, method, {id: path});
  }

  public static unsubscribe(path){
    this._connection.getSocket().unsubscribe(path);
  }

  public static isConnected():boolean{
    if(this._connection != undefined){
      return this._connection.isConnected();
    }
    return false;
  }

  public static setOnCloseEvent(event){
    this._connection.setOnCloseEvent(event);
  }
}
