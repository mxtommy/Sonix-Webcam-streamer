import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


export interface feed_options {
  [key: string]: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  websocketStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  feed_options: BehaviorSubject<feed_options> = new BehaviorSubject<feed_options>({});


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

    //this.webSocket = new WebSocket("ws://" + location.hostname + ":8001");
    this.webSocket = new WebSocket("ws://192.168.1.122:8001");
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

      if ('feed_options' in jsonObject) {
        this.feed_options.next(jsonObject['feed_options']);
      }
    }

  }


  initControls() {
    // get the initial information we need
    this.webSocket?.send(JSON.stringify({'get_feed_options':1}));

  }


  setBitrate(bitrate:number) {
    this.webSocket?.send(JSON.stringify({'set_bitrate_kbps':bitrate}));
  }

  getFeedOptions(): Observable<feed_options> {
    return this.feed_options.asObservable();
  }


  updateResFPS(new_resolution: string, new_fps: string) {
    this.webSocket?.send(JSON.stringify({'set_resolution_fps': {'resolution': new_resolution, 'fps':  new_fps}}));
  }

  updateV4L2Ctrl(control_name: string, value: any) {
    this.webSocket?.send(JSON.stringify({'set_v4l2_ctrl': {'control_name': control_name, 'value':  value}}));

  }


}
