import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

  private socket: WebSocket;
  private messagesSubject = new Subject<string>();
  public messages$ = this.messagesSubject.asObservable();
  private WEB_SOCKET_URL: string = environment.WEB_SOCKET_URL;


  constructor() { 
    this.socket = new WebSocket(this.WEB_SOCKET_URL);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message;
      this.messagesSubject.next(message);
    };

    this.socket.onopen = () => {
      console.log('Connected to the WebSocket server');
    };

    this.socket.onclose = () => {
      console.log('Disconnected from the WebSocket server');
    };
  }

  sendMessage(message: string): void {
    this.socket.send(JSON.stringify({ message }));
  }

}
