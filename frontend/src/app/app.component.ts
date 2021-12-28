import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebsocketService } from './websocket.service';
import { WebrtcService } from './webrtc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  menu_opened: boolean = true;
  websocketStatus: boolean = false;
  webrtcStatus: boolean = false;
  videoSizeText: string|null = null;
  bitrate: string|null = null;
  wsColor: string = "red";
  rtcColor: string = "red";

  constructor(
    private WebsocketService: WebsocketService,
    private WebrtcService: WebrtcService,
    private ChangeDetectorRef: ChangeDetectorRef
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

    this.WebrtcService.getVideoStreamSize().subscribe(
      size => {
        this.videoSizeText = size;
        this.ChangeDetectorRef.detectChanges();
      }
    );

    this.WebrtcService.getBitrate().subscribe(
      bitrate => {
        this.bitrate = bitrate;
        this.ChangeDetectorRef.detectChanges();
      }
    )

  }


}
