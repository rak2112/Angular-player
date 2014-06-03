module.exports = function(grunt) {
'use strict';
  // Project configuration.
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      all: {
        options: {
          port: 9003,
          hostname: "0.0.0.0",
          bases: [__dirname] 
        }
      }
    },
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    },
      sass: {                              
    dist: {                            
      options: {                      
        style: 'expanded'
      },
      files: {                       
        'css/base/styles.css': 'sass/styles.scss'       
      }
    }
  },
    less: {
      development: {
        options: {
          paths: ["css"]
        },
        files: {
          "css/styles.css": "css/styles.less"
        }
      }
    },
    jshint: {
      options:{
        jshintrc: '.jshintrc',

      },
      all: ['js/src/*.js'] 
    },

    concat: {
        css: {
           src: [
                 'css/base/*.css'
                ],
            dest: 'css/styles.css'
        },
        js : {
            src : ['js/src/*.js'],
            dest : 'js/main.js'
        },
        plugins:{
          src: ['js/vendors/jquery.min.js','js/vendors/angular.min.js', 'js/vendors/*.js'],
          dest: 'js/vendors.min.js'
        }
    },

    cssmin : {
            css:{
                src: 'css/styles.css',
                dest: 'css/styles.min.css'
            }
        },

     uglify : {
        js: {
            files: {
                'js/main.min.js' : [ 'js/main.js' ]
            }
        }
    }, 
    imagemin: { 
    options : {
        cache: false
      },                        
    dist: {                        
      files: [{
        expand: true,                  
        cwd: 'img/',                   
        src: ['**/*.{png,jpg,gif}'],  
        dest: 'dist/'                  
      }]
    }
  },   
  ngmin: {
  files: [{                    
        cwd: '/',                   // Src matches are relative to this path
        src: ['dest/js/main.js'],   // Actual patterns to match
        dest: 'dest/js/main.js'                  // Destination path prefix
      }]
},

   watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['**/*.scss', 'index.html','app.js'],
        tasks: ['build'],
      },
      js: {
         files: ['<%= jshint.all %>'],
         tasks:['concat', 'jshint']
      }
    },
 karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

compass: {                  
    dist: {                   
      options: {              
        sassDir: 'sass',
        cssDir: 'css',
        environment: 'production'
      }
    },
    dev: {                   
      options: {
        compass: true,
        sassDir: 'sass',
        cssDir: 'css'
      }
    }
  },
  htmlhint: {
    build: {
        options: {
            'tag-pair': true,
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': true,
            'doctype-first': true,
            'spec-char-escape': true,
            'id-unique': true,
            'head-script-disabled': true,
            'style-disabled': true
        },
        src: ['index.html']
    }
},
htmlmin: {
  collapseBooleanAttributes:      true,
  collapseWhitespace:             true,
  removeAttributeQuotes:          true,
  removeComments:                 true, // Only if you don't use comment directives!
  removeEmptyAttributes:          true,
  removeRedundantAttributes:      true,
  removeScriptTypeAttributes:     true,
  removeStyleLinkTypeAttributes:  true
},
ngtemplates:  {
  angPlayer:        {
    src:      'templates/**.html',
    dest:     'js/src/templates.js',
    options: {
      // htmlmin:  '<%= htmlmin.app %>'
      htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true, removeComments: true}
      //htmlmin:  '<%= htmlmin.app %>' for already using htmlmin see above.....
    }
  }
}

});

 grunt.registerTask('server', [
    'express',
    'open',
    'express-keepalive'
  ]);

 grunt.registerTask('build', [
    'sass',
    'ngtemplates',
    'concat',
    'uglify',
    'cssmin',
    'jshint'
  ]);
  
  grunt.registerTask('default', 
    ['connect', 
    'concat:css',
    'concat:js',
    'uglify:js', 
    'jshint', 
    'less', 
    'watch', 
    'imagemin', 
    'sass', 
    'compass', 
    'karma'
  ]);

};