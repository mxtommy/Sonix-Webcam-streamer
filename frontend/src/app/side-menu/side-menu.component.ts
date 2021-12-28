import { Component, OnInit } from '@angular/core';
import { WebsocketService, feed_options } from '../websocket.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  bitrate: number = 300;
  resolution: string = "320x240";
  fps: string = "30";
  exposure_auto: string = "3"
  exposure_absolute: number = 156;
  gain: number = 0;
  white_balance_temperature_auto: string = "1";
  white_balance_temperature: number = 4600;



  feedOptions: feed_options = {};
  availFPS: Array<string> = ["30", "25", "15"];

  constructor(private WebsocketService: WebsocketService) { }

  ngOnInit(): void {
    this.WebsocketService.getFeedOptions().subscribe(
      options => {
        this.feedOptions = options;
       }
    );
  }


  updateFPSforRes() {
    this.availFPS = this.feedOptions[this.resolution];
  }

  updateBitrate(){
    console.log("Updating bitrate:"+ this.bitrate);
    this.WebsocketService.setBitrate(this.bitrate);
  }

  updateResFPS(){
    console.log("Updating Res/FPS:"+ this.resolution + " - " + this.fps );
    this.WebsocketService.updateResFPS(this.resolution, this.fps);
  }

  update_v4l2_ctl(control_name: string, value: any) {
    this.WebsocketService.updateV4L2Ctrl(control_name, value);
  }


}
