import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  websocketStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Websocket
  webSocket: WebSocket|null = null;


  constructor() { 
    this.webSocketBegin();
  }

  getWebsocketStatusAsO(): Observable<boolean> {
    return this.websocketStatus.asObservable();
  }


  resetWebsocket() {
    // clean close if open
    if (this.webSocket !== null && this.webSocket.readyState < 2) { // 0 = connecting, 1 = open, 2 = closing, 3 = closed
      console.debug("Closing existing WS Connection")
      this.webSocket.close();
    }
    setTimeout(()=>{ this.webSocketBegin();}, 3000);
  }


  webSocketBegin() {
    // don't reopen an existing connection
    if (this.webSocket !== null && this.webSocket.readyState < 2) { // 0 = connecting, 1 = open, 2 = closing, 3 = closed
      return;
    }

    this.webSocket = new WebSocket("ws://" + location.hostname + ":8001");

    this.webSocket.onopen = (event) => {
      console.log("Websocket connected!");
      this.websocketStatus.next(true);

      this.initControls();
    }

    this.webSocket.onerror = (event) => {
      console.log(event);
      this.websocketStatus.next(false);

      setTimeout(()=>{ this.webSocketBegin();}, 3000);
    }

    this.webSocket.onclose = (event) => {
      this.websocketStatus.next(false);

      setTimeout(()=>{ this.webSocketBegin();}, 3000);
    }

    this.webSocket.onmessage = (message) => {
      var jsonObject = JSON.parse(message.data);
      console.log(jsonObject);
    }

  }


  initControls() {
    // get the initial information we need
    this.webSocket?.send(JSON.stringify({'get_feed_options':1}));




  }

}
