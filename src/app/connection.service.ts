import { Injectable } from '@angular/core';
import { Client } from '../utils/client';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private _connection: Client) { 

  }

  connect(host, port, on_connected_event){
    this._connection = new Client();
    this._connection.connect(host, port, on_connected_event); // TODO: sprawdzić, czy to tak powinno wyglądać
  }
}
