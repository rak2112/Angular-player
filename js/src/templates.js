angular.module('angPlayer').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/albumView.html',
    "<div class=\"row\" style=\"position:relative\"><ul id=\"songsList\" class=\"thumbnails unstyled\"><li id=\"song{{song.pid}}\" data-spid=\"{{song.pid}}\" class=\"cat plan\" ng-repeat=\"song in subalbum\" ng-click=\"songClicked(song.pid)\"><img src=\"/images/{{song.image}}\"><div class=\"plan-name-bronze\"><h2>{{song.title}}</h2><p>{{song.artist}}</p><p>{{song.album}}-{{song.year}}</p></div></li></ul></div>"
  );


  $templateCache.put('templates/appView.html',
    "<div id=\"albumView\"><div class=\"note\" show-hide=\"\">Select an album to add songs in playlist.</div><div class=\"prod-list\"><ul id=\"albumList\" class=\"thumbnails unstyled\"><li id=\"album{{album.pid}}\" data-pid=\"{{album.pid}}\" class=\"cat plan\" ng-repeat=\"album in albums\" ng-click=\"aClicked(album.pid)\"><img src=\"/images/{{album.image}}\"><div class=\"plan-name-bronze\"><h2>{{album.artist}}</h2><h3>{{album.title}}</h3><p>{{album.years}}</p></div></li></ul></div></div>"
  );


  $templateCache.put('templates/playList.html',
    "<audio id=\"player\" autoplay=\"true\" controls=\"\" preload=\"none\" src=\"\" type=\"audio/mpeg\"></audio><div id=\"songsCollection\" ng-controller=\"playListController\"><div class=\"menu\" ng-hide=\"isVisible()\"><a ng-href=\"#/\" id=\"gotoHome\"><i class=\"glyphicon glyphicon-home\"></i> All Albums</a> <a href=\"\" id=\"playAll\" ng-click=\"playAll()\"><i class=\"glyphicon glyphicon-play\"></i> Play All</a> <a href=\"\" id=\"removeAll\" ng-click=\"removeAll()\"><i class=\"glyphicon glyphicon-trash\"></i> Remove All</a></div><ul><li ng-repeat=\"song in songs\" ng-class=\"{selected:player == $index}\" ng-click=\"playSong($index)\"><a class=\"song\" href=\"\"><img src=\"/images/{{song.image}}\"> <span><i class=\"glyphicon glyphicon-music\"></i></span>{{song.title}}</a> <a href=\"\" ng-click=\"removeSong($index)\" id=\"remove\"><i class=\"glyphicon glyphicon-remove\"></i></a></li></ul></div>"
  );

}]);
