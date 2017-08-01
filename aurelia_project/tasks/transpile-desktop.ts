import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as eventStream from 'event-stream';
import * as changedInPlace from 'gulp-changed-in-place';
import * as plumber from 'gulp-plumber';
import * as notify from 'gulp-notify';
import * as merge from 'merge2';
import * as project from '../aurelia.json';

var typescriptCompiler = typescriptCompiler || null;

export default function electron() {

  typescriptCompiler = ts.createProject('tsconfig.json', {
    "typescript": require('typescript'),
    "target": "es2017",
    "module": "none"
  });

  let dts = gulp.src(project.transpiler.dtsSource);

  let src = gulp.src(project.electron.source)
    .pipe(changedInPlace({firstPass: true}));

  var tsResult = eventStream.merge(dts, src)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(typescriptCompiler());

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest(project.electron.output + '/electron/definitions')),
        tsResult.js.pipe(gulp.dest(project.electron.output + '/electron/js'))
    ]);
}

