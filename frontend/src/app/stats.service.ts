import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class StatsService {

  bitrate: BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);
  resolution: BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null);



  constructor() { }

  // BitRate
  getBitrateObservable(): Observable<number|null> {
    return this.bitrate.asObservable();
  }
  setBitrate(bitrate: number|null) {
    this.bitrate.next(bitrate);
  }

  getResolutionObservable(): Observable<string|null> {
    return this.resolution.asObservable();
  }
  setResolution(resolution: string|null) {
    this.resolution.next(resolution);
  }



}
