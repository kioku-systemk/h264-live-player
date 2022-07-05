"use strict";


const spawn  = require('child_process').spawn;
const merge  = require('mout/object/merge');

const Server = require('./_server');


class FFMpegServer extends Server {

  constructor(server, opts) {
    super(server, merge({
      fps : 15,
      x: 0,
      y: 0
    }, opts));
  }

  get_feed() {

    var args = [
        "-f", "gdigrab",
        "-framerate", this.options.fps,
        "-offset_x", 10, 
        "-offset_y", 20, 
        "-video_size", this.options.width + 'x' + this.options.height,
        '-i',  'desktop', 
        '-pix_fmt',  'yuv420p',
        '-c:v',  'libx264',
        '-vprofile', 'baseline',
        '-tune', 'zerolatency',
        '-f' ,'rawvideo',
        '-'
    ];

      //https://trac.ffmpeg.org/wiki/Limiting%20the%20output%20bitrate
    var args = [
        "-f", "gdigrab",
        "-framerate", this.options.fps,
        "-offset_x", this.options.x, 
        "-offset_y", this.options.y, 
        "-framerate", this.options.fps,
        "-video_size", this.options.width + 'x' + this.options.height,
        '-i',  'desktop', 
        '-pix_fmt',  'yuv420p',
        '-c:v',  'libx264',
        '-b:v', '2000k',
        '-force_key_frames', 'expr:gte(t,n_forced*2)',
        '-bufsize', '2000k',
        '-vprofile', 'baseline',
        '-tune', 'zerolatency',
        '-f' ,'rawvideo',
        '-'
    ];


    console.log("ffmpeg " + args.join(' '));
    var streamer = spawn('ffmpeg', args);
    streamer.stderr.pipe(process.stderr);

    streamer.on("exit", function(code){
      console.log("Failure", code);
    });

    return streamer.stdout;
  }

};


module.exports = FFMpegServer;


