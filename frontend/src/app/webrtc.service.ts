import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var Janus: any; // 3rd party


@Injectable({
  providedIn: 'root'
})
export class WebrtcService {

  webrtcStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  webrtcStatusString: BehaviorSubject<string> = new BehaviorSubject<string>("Init");

  server = "http://" + window.location.hostname + ":8088/janus";
  opaqueId = "streamingtest-"+Janus.randomString(12);
  janus:any = null;
  streaming: any = null;
  selectedStream: number|null = null;
  streamsList: [{id: number; description: string, type: string}]|null = null;

  bitrateTimer: number|null = null;

  constructor() { 
    this.initialize();
  }


  initialize() {
    Janus.init({debug: "all", callback: () => {
      if(!Janus.isWebrtcSupported()) {
          alert("No WebRTC support... ");
          return;
      }
      this.janus = new Janus({
        server: this.server,
        success: () => {
          // Attach to Streaming plugin
          this.janus.attach({
            plugin: "janus.plugin.streaming",
            opaqueId: this.opaqueId,
            success: (pluginHandle: any) => {
                this.webrtcStatus.next(true);
                this.streaming = pluginHandle;
                console.log("Plugin attached! (" + this.streaming.getPlugin() + ", id=" + this.streaming.getId() + ")");
                this.updateStreamsList();
            },
            error: (error: any) => {
                this.webrtcStatus.next(false);
                console.error("  -- Error attaching plugin... ", error);
                alert("Error attaching plugin... " + error);
            },
            iceState: (state: any) => {
                console.log("ICE state changed to " + state);
            },
            webrtcState: (on: any) => {
                console.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
            },
            onmessage: (msg:any, jsep:any) => {
                Janus.debug(" ::: Got a message :::", msg);
                var result = msg["result"];
                if(result) {
                    if(result["status"]) {
                        var status = result["status"];
                        if(status === 'starting')
                          this.webrtcStatusString.next("Starting, please wait...");
                        else if(status === 'started')
                          this.webrtcStatusString.next("Started");
                        else if(status === 'stopped')
                            this.stopStream();
                    } else if(msg["streaming"] === "event") {
                        // Is simulcast in place?
                        /*
                        var substream = result["substream"];
                        var temporal = result["temporal"];
                        if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                            if(!simulcastStarted) {
                                simulcastStarted = true;
                                addSimulcastButtons(temporal !== null && temporal !== undefined);
                            }
                            // We just received notice that there's been a switch, update the buttons
                            updateSimulcastButtons(substream, temporal);
                        }
                        
                        // Is VP9/SVC in place?
                        var spatial = result["spatial_layer"];
                        temporal = result["temporal_layer"];
                        if((spatial !== null && spatial !== undefined) || (temporal !== null && temporal !== undefined)) {
                            if(!svcStarted) {
                                svcStarted = true;
                                addSvcButtons();
                            }
                            // We just received notice that there's been a switch, update the buttons
                            updateSvcButtons(spatial, temporal);
                        }
                        */
                    }
                } else if(msg["error"]) {
                    alert(`WebRTC Error: ${msg["error"]}`);
                    this.stopStream();
                    return;
                }
                if(jsep) {
                    Janus.debug("Handling SDP", jsep);
                    var stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
                    // Offer from the plugin, let's answer
                    this.streaming.createAnswer(
                        {
                            jsep: jsep,
                            // We want recvonly audio/video and, if negotiated, datachannels
                            media: { audioSend: false, videoSend: false, data: true },
                            success: (jsep: any) => {
                                Janus.debug("Got SDP!", jsep);
                                var body = { request: "start" };
                                this.streaming.send({ message: body, jsep: jsep });
                                //$('#watch').html("<i class=\"fas fa-video\"></i>").removeAttr('disabled').click(stopStream);
                            },
                            error: (error:any) => {
                                Janus.error("WebRTC error:", error);
                                alert("WebRTC error... " + error.message);
                            }
                        });
                }
            },
            onremotestream: function(stream: any) {
                Janus.debug(" ::: Got a remote stream :::", stream);
                let videoContainer = document.getElementById("remotevideo");


                /*
                var addButtons = false;
                if($('#remotevideo').length === 0) {
                    addButtons = true;
                    $('#stream').append('<video class="rounded centered hide" id="remotevideo" width="100%" height="100%" playsinline/>');
                    $('#remotevideo').get(0).volume = 0;
                    // Show the stream and hide the spinner when we get a playing event
                    $("#remotevideo").bind("playing", function () {
                        $('#waitingvideo').remove();
                        if(this.videoWidth)
                            $('#remotevideo').removeClass('hide').show();
                        if(spinner)
                            spinner.stop();
                        spinner = null;
                        var videoTracks = stream.getVideoTracks();
                        if(!videoTracks || videoTracks.length === 0)
                            return;
                        var width = this.videoWidth;
                        var height = this.videoHeight;
                        $('#curres').removeClass('hide').text(width+'x'+height).show();
                        if(Janus.webRTCAdapter.browserDetails.browser === "firefox") {
                            // Firefox Stable has a bug: width and height are not immediately available after a playing
                            setTimeout(function() {
                                var width = $("#remotevideo").get(0).videoWidth;
                                var height = $("#remotevideo").get(0).videoHeight;
                                $('#curres').removeClass('hide').text(width+'x'+height).show();
                            }, 2000);
                        }
                    });
                } */
                Janus.attachMediaStream(videoContainer, stream);
                //videoContainer.volume = 0;
                //$("#remotevideo").get(0).play();
                //var videoTracks = stream.getVideoTracks();

                /*
                if(!videoTracks || videoTracks.length === 0) {
                    // No remote video
                    $('#remotevideo').hide();
                    if($('#stream .no-video-container').length === 0) {
                        $('#stream').append(
                            '<div class="no-video-container">' +
                                '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                '<span class="no-video-text">No remote video available</span>' +
                            '</div>');
                    }
                } else {
                    $('#stream .no-video-container').remove();
                    $('#remotevideo').removeClass('hide').show();
                }
                if(!addButtons)
                    return;
                if(videoTracks && videoTracks.length &&
                        (Janus.webRTCAdapter.browserDetails.browser === "chrome" ||
                            Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
                            Janus.webRTCAdapter.browserDetails.browser === "safari")) {
                    $('#curbitrate').removeClass('hide').show();
                    bitrateTimer = setInterval(function() {
                        // Display updated bitrate, if supported
                        var bitrate = streaming.getBitrate();
                        $('#curbitrate').text(bitrate);
                        // Check if the resolution changed too
                        var width = $("#remotevideo").get(0).videoWidth;
                        var height = $("#remotevideo").get(0).videoHeight;
                        if(width > 0 && height > 0)
                            $('#curres').removeClass('hide').text(width+'x'+height).show();
                    }, 1000);
                }

                //TODO: added temporary
                document.getElementById("remotevideo").mute=true;
                document.getElementById("remotevideo").volume=0.0;
                */
            },
            ondataopen: (data: any) => {
                Janus.log("The DataChannel is available!");
                /*
                $('#waitingvideo').remove();
                $('#stream').append(
                    '<input class="form-control" type="text" id="datarecv" disabled></input>'
                );
                if(spinner)
                    spinner.stop();
                spinner = null;
                */
            },
            ondata: (data: any) => {
                Janus.debug("We got data from the DataChannel!", data);
                /*
                $('#datarecv').val(data); */
            },
            oncleanup: () => {
                Janus.log(" ::: Got a cleanup notification :::");
                this.webrtcStatus.next(false);
                /*
                $('#waitingvideo').remove();
                $('#remotevideo').remove();
                $('#datarecv').remove();
                $('.no-video-container').remove();
                $('#bitrate').attr('disabled', true);
                $('#bitrateset').html('Bandwidth<span class="caret"></span>');
                $('#curbitrate').hide();
                if(bitrateTimer)
                    clearInterval(bitrateTimer);
                bitrateTimer = null;
                $('#curres').hide();
                $('#simulcast').remove();
                $('#metadata').empty();
                $('#info').addClass('hide').hide();
                simulcastStarted = false;
                */
            }
          });
        },
        error: (error: any) => {
          Janus.error(error);
          alert(error);
        },
        destroyed: () => {
        //window.location.reload();
        }
      });
    }}); // end Janus.init


  }

  updateStreamsList() {
    var body = { request: "list" };
    Janus.debug("Sending message:", body);
    this.streaming.send({ message: body, success: (result:any) => {
      //setTimeout(function() {
      //  $('#update-streams').removeClass('fa-spin').click(updateStreamsList);
      //}, 500);
      if(!result) {
        alert("Got no response to our query for available streams");
        return;
      }
      if(result["list"]) {
        //$('#streams').removeClass('hide').show();
        //$('#streamslist').empty();
        //$('#watch').attr('disabled', true).unbind('click');
        var list = result["list"];
        Janus.log("Got a list of available streams");
        console.log(list);
        this.streamsList = list;
        this.startStream();
      }
    }});
  }

  startStream() {

    if (this.streamsList === null) { return; }
    let stream = this.streamsList.find(stream => stream.description.includes("264") )
    if (!stream) { console.log("H264 Stream not found"); return }
    this.selectedStream = stream.id;

    Janus.log("Selected video id #" + this.selectedStream);
    this.webrtcStatusString.next("Selected video id #" + this.selectedStream);

    var body = { request: "watch", id: this.selectedStream};
    this.streaming.send({ message: body });
  
  }

  stopStream() {
    var body = { request: "stop" };
    this.streaming.send({ message: body });
    this.streaming.hangup();
    if(this.bitrateTimer)
      clearInterval(this.bitrateTimer);
    this.bitrateTimer = null;
  }


  getWebRTCStatus(): Observable<boolean> {
    return this.webrtcStatus.asObservable();
  }

  getWebRTCStatusString(): Observable<string> {
    return this.webrtcStatusString.asObservable();
  }

}
