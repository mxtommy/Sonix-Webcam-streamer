import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebsocketService } from './websocket.service';
import { WebrtcService } from './webrtc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  menu_opened: boolean = true;
  websocketStatus: boolean = false;
  webrtcStatus: boolean = false;
  wsColor: string = "red";
  rtcColor: string = "red";

  constructor(
    private WebsocketService: WebsocketService,
    private WebrtcService: WebrtcService
  ) {}

  ngOnInit() {
    this.WebsocketService.getWebsocketStatusAsO().subscribe(
      status => {
        this.websocketStatus = status;
        if (status) { this.wsColor = "green"} else {this.wsColor = "red"}
       }
    );

    this.WebrtcService.getWebRTCStatus().subscribe(
      status => {
        this.webrtcStatus = status;
        if (status) { this.rtcColor = "green"} else {this.rtcColor = "red"}
       }
    );
  }


}
