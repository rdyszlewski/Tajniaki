import { Injectable } from '@angular/core';
import { Client } from '../utils/client';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private static _connection:Client;

  public static connect(host, port, on_connected_event){
    this._connection = new Client();
    this._connection.connect(host, port, on_connected_event); // TODO: sprawdzić, czy to tak powinno wyglądać
  }

  public static send(message, path){
    this._connection.write(message, path);
  }

  public static subscribe(path, method){
    console.log(path);
    this._connection.getSocket().subscribe(path, method);
  }
}
