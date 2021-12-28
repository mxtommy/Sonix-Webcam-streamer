import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatChipsModule } from '@angular/material/chips'; 
import { MatSliderModule } from '@angular/material/slider'; 
import { MatDividerModule } from '@angular/material/divider'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StatsService } from './stats.service';
import { WebrtcService } from './webrtc.service';
import { WebsocketService } from './websocket.service';
import { SideMenuComponent } from './side-menu/side-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSliderModule,
    MatDividerModule,
    BrowserAnimationsModule
  ],
  providers: [
    StatsService,
    WebrtcService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
