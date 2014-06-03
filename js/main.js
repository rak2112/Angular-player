'use strict';
var angPlayer = angular.module('angPlayer', ['ngRoute', 'ngResource', 'ngAnimate']);
angPlayer.config(['$routeProvider', '$locationProvider',
function($routeProvider) {
	//$locationProvider.baseHref = "/angularplayer/";
	$routeProvider.
	when('/', {
		templateUrl: '/templates/appView.html',
		controller: 'mainController'
	}).
	when('/album/:albumId', {
		templateUrl: '/templates/albumView.html',
		controller: 'albumController'
	}).
	otherwise({
		redirectTo: '/'
	});
}
]);

angPlayer.directive('audioPlayer', ['dataProcessor', '$rootScope', function(dataProcessor, $rootScope){
	return{
		restrict:'A',
		link: function(){
			var audio = document.getElementById('player');
			audio.addEventListener('ended', function() {
				dataProcessor.current++;
				dataProcessor.playNext();
				$rootScope.$apply();
			}, false);
		}
	};
}]);
angPlayer.directive('showHide', ['$routeParams',  function($routeParams){
	return{
		restrict:'A',
		link: function(scope){
			var menu = document.querySelector('.menu');
			scope.$on('$routeChangeSuccess', function() {
				var param = $routeParams;
				if(param.albumId){
					menu.style.display = 'block';
				}
				else {
					menu.style.display = 'none';
				}
			});
		}
	};
}]);

	//angular.module('kServices', ['ngResource'])
angPlayer.factory('dataSource', function($resource) {
	return $resource('/data/dataAudio.json');
});
angPlayer.factory('dataProcessor', function($resource, dataSource, audio, $rootScope, $filter) {
	// audio.addEventListener('ended', function() {
	// 		//console.log('ended......');
	// 		this.current++;
	// 		this.playNext();
	// 		$rootScope.$apply();
	// 	}, false).bind(dataProcessor);

	return {
		// var player = {};
		data: [],
		current:0,
		emptyPlaylist: function(){
			this.data.length = 0;
			this.current = 0;
			return this.data;
		},
		deleteSong: function(index) {
			this.data.splice(index, 1);
			if (index < this.current) {
				this.current--;
				console.log('les thn current');
			}
			else if(this.current === index) {
				console.log('already playing...');
				this.playNext();
			}
		},
		playAll: function(album) {
			angular.forEach(album, function(song) {
				this.data.push(song);
				if (this.data.length < 2) {
					this.playNext();
				}
			}, this);
			//console.log('factory lenth',player.data.length);
			return this.data;
		},
		getCollection: function(song) {
			var obj = song[0];
			if (!this.data.length) {
				this.data.push(obj);
				this.playNext();
			} else {
				var inList = $filter('filter')(this.data, {
					pid: obj.pid
				});
				//console.log('inlist',inList);
				if (!inList.length) {
					this.data.push(obj);
				}
			}
			return this.data;
		},

		playThis: function(index) {
			this.current = index;
			this.playNext();
		},
		play: function(mediaSrc) {
			// console.log('mediasrc',mediaSrc);
			audio.src = mediaSrc;
			audio.play();
		},

		playNext: function() {
			var nxtSong = this.data[this.current];
			if (nxtSong) {
				var mediaSrc = nxtSong.media;
				this.play(mediaSrc);
			}
		}
	};
});
angPlayer.factory('audio', function() {
			//var audio = angular.element('#player')[0];
			var audio = document.getElementById('player');
			return audio;
		});

angPlayer.controller('mainController', ['$scope', 'dataSource', '$location',
	function($scope, dataSource, $location) {
		// dataSource.get(function(data, status) {
		// console.log('data', status());
		// $scope.albums = data.records;
		// });
		dataSource.get().$promise.then(
			function(data){
				$scope.albums = data.records;
			},
			function(error){
				console.log('error',error.status);
			}
		);

		$scope.aClicked = function(id) {
			var hash = '/album/' + id;
			$location.path(hash);
		};
	}
]);

angPlayer.controller('albumController', ['$scope', 'dataSource', '$filter', '$routeParams', '$rootScope',
	function($scope, dataSource, $filter, $routeParams, $rootScope) {
		var album,albums,clickedAlbum;
		dataSource.get(function(data) {
			albums = data.records;
			clickedAlbum = $filter('filter')(albums, {
				pid: $routeParams.albumId
			});
			if(clickedAlbum.length){
				album = clickedAlbum[0].subalbum;
				$scope.subalbum = album;
			}
		});
		$scope.songClicked = function(songId) {
			$rootScope.$broadcast('songClicked', songId, album); //not good technique to broadCast on rootScope it often get's a
			//performance hit, but in this case only one scope is downWards.
		};
	}
]);

angPlayer.controller('playListController', ['$scope', 'dataSource', 'dataProcessor', '$filter', '$rootScope', '$routeParams',
	function($scope, dataSource, dataProcessor, $filter, $rootScope, $routeParams) {
		$scope.$on('songClicked', function(obj, songId, subalbum) {
			var song = $filter('filter')(subalbum, {
				pid: songId
			});
			$scope.songs = dataProcessor.getCollection(song);
			// console.log('song clollection', $scope.songs);
		});

		$scope.playAll = function() {
			var album;
			dataSource.get(function(data) {
				//console.log('data', data.records);
				var albums = data.records;
				if($routeParams.albumId){
					var clickedAlbum = $filter('filter')(albums, {
						pid: $routeParams.albumId
					});
					album = clickedAlbum[0].subalbum;
					$scope.songs = dataProcessor.playAll(album);
				}
				
			});
		};
		$scope.removeAll = function(){
			dataProcessor.emptyPlaylist();
		};

		$scope.$watch(function() {
			return dataProcessor.current;
		}, function(current) {
			$scope.player = current;
		});
		$scope.playSong = function(index) {
			dataProcessor.playThis(index);
			// console.log('index to play song', index);
		};

		$scope.removeSong = function(index) {
			dataProcessor.deleteSong(index);
		};
	}
]);

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