var gulp = require('gulp');
var path = require('path');

var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var liveReload = require('gulp-livereload');
var rename = require('gulp-rename');
var cond = require('gulp-cond');
var uglify = require('gulp-uglify');

var less = require('gulp-less');

var gbro = require('gulp-browserify');
var reactify = require('reactify');
var envify = require('envify');


function errHandler(err){
    gutil.beep();
    gutil.log(err);
}


var productTasks = [undefined, 'default'];
var proEnv = false;

var taskName = (process.argv[0] === 'node')? process.argv[2] : process.argv[1];
if( productTasks.indexOf(taskName) >= 0 ){
    proEnv = true;
}

var conf = {
    lessPath: 'layout/less',
    cssPath: 'layout/css',
    jsPath: 'lib',
    less: {
        file: ['layout*.less'],
        watch: ['**/*.less']
    },
    js: {
        file: ['app.js'],
        watch: ['**/*.js'],
        reload: ['bundle.js']
    }
};

for(var i in conf.less){
    conf.less[i] = conf.less[i].map(function(p){
        return path.join(conf.lessPath, p);
    });
}
conf.less.reload = path.join(conf.cssPath, 'layout*.css');
conf.less.dest = conf.cssPath;
for(var i in conf.js){
    conf.js[i] = conf.js[i].map(function(p){
        return path.join(conf.jsPath, p);
    });
}
conf.js.watch.push( '!'+conf.js.reload );
// console.log(conf);

gulp.task('less', function(){
    return gulp.src( conf.less.file )
        .pipe( plumber({errorHandler: errHandler}) )
        .pipe( cond( proEnv, less({
            compress: true
        }), less({
            dumpLineNumbers: 'comments'
        })
        ) )
        .pipe( gulp.dest( conf.less.dest) );
});


gulp.task('react', function(){
    return gulp.src( conf.js.file )
        .pipe(plumber({errorHandler: errHandler}))
        .pipe(gbro({
            transform: [reactify, envify],
            debug: !proEnv
        }))
        .pipe( cond(proEnv, uglify()) )
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest( conf.jsPath ));
});


gulp.task('watch', function(){
    liveReload.listen();

    gulp.watch(conf.less.watch,  ['less']);
    gulp.watch(conf.less.reload, liveReload.changed);

    gulp.watch(conf.js.watch, ['react']);
    gulp.watch(conf.js.reload, liveReload.changed);
    gulp.watch('./index.html', liveReload.changed);

});

gulp.task('default', ['less', 'react']);
gulp.task('wd', ['less', 'react', 'watch']);
