import * as gulp from 'gulp';
import * as browserSync from 'browser-sync';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import * as project from '../aurelia.json';
import build from './build';
import * as electronConnect from 'electron-connect';
import {CLIOptions} from 'aurelia-cli';

var electron = electronConnect.server.create();

function onChange(path) {
  console.log(`File Changed: ${path}`);
}

function reloadClient(done) {
  if (CLIOptions.hasFlag('desk')){
    electron.reload();
  }else{
    browserSync.reload();
  }  
  done();
}

function reloadServer(done) {
  if (CLIOptions.hasFlag('desk')){
    electron.restart();
  }else{
    browserSync.reload();
  }  
  done();
}

let serve = gulp.series(
  build,
  done => {

    if (CLIOptions.hasFlag('desk')){
      electron.start();
      done();
    }else{

      browserSync({
        online: false,
        open: false,
        port: 9000,
        logLevel: 'silent',
        server: {
          baseDir: [project.platform.baseDir],
          middleware: [historyApiFallback(), function(req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
          }]
        }
      }, function (err, bs) {
        if (err) return done(err);
        let urls = bs.options.get('urls').toJS();
        console.log(`Application Available At: ${urls.local}`);
        console.log(`BrowserSync Available At: ${urls.ui}`);
        done();
      });
    }

  }
);

let refreshClient = gulp.series(
  build,
  reloadClient
);

let refreshServer = gulp.series(
  build,
  reloadServer
);

let watch = function(refreshServerCb, refreshClientCb, onChangeCb) {
  return function(done) {
    
    gulp.watch(project.transpiler.source, refreshClientCb).on('change', onChangeCb);
    gulp.watch(project.markupProcessor.source, refreshClientCb).on('change', onChangeCb);
    gulp.watch(project.cssProcessor.source, refreshClientCb).on('change', onChangeCb);

    gulp.watch(project.electron.source, refreshServerCb).on('change', onChangeCb);

    //see if there are static files to be watched
    if (typeof project.build.copyFiles === 'object') {
      const files = Object.keys(project.build.copyFiles);
      gulp.watch(files, refreshClientCb).on('change', onChangeCb);
    }
  };
};

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    watch(refreshServer, refreshClient, onChange)
  );
} else {
  run = serve;
}

export { run as default, watch };

