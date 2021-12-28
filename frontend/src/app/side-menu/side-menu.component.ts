import { Component, OnInit } from '@angular/core';
import { WebsocketService, feed_options } from '../websocket.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  bitrate: number = 300;
  resolution: string|null = null;

  feedOptions: feed_options = {};

  constructor(private WebsocketService: WebsocketService) { }

  ngOnInit(): void {
    this.WebsocketService.getFeedOptions().subscribe(
      options => {
        this.feedOptions = options;
       }
    );
  }


  updateBitrate(){
    console.log("Updating bitrate:"+ this.bitrate);
    this.WebsocketService.setBitrate(this.bitrate);
  }

}
