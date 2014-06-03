'use strict'; 
    var album = {"records":[
    {
        "title": "Classic Pop",
        "artist": "Michael Jackson Collection",
        "image": "1.jpg",
        "years": "1975-2010",
        "pid" : 0,
        "id" : 5,
        "url": "http://www.amazon.com/",
        "subalbum": [
            {
                "title": "Michael",
                "artist": "Michael Jackson",
                "image": "michael_small.jpg",
                "large_image": "images/michael_large.jpg",
                "year": 1988,
                "pid": 0,
                "media": "songs/1.mp3",
                "album": "Michael" 
            },
            {
                "title": "This Is It",
                "artist": "Michael Jackson",
                "image": "thisisit_small.jpg",
                "large_image": "images/thisisit_large.jpg",
                "year": 1987,
                "pid": 1,
                "media": "songs/2.mp3",
                "album": "Bad" 
            }
        ] 
    },
    {
        "title": "Modern Pop/R&B",
        "artist": "Bruno Mars and Others",
        "image": "gernade.jpg",
        "years": "1999-2011",
        "pid" : 1,
        "url": "http://www.amazon.com/",
        "subalbum": [
            {
                "title": "Gernade",
                "artist": "Bruno Mars",
                "image": "gernade.jpg",
                "large_image": "images/gernade.jpg",
                "year": 2010,
                "pid": 5,
                "media":"songs/gernade.mp3",
                "url": "http://www.amazon.com/" 
            },
            {
                "title": "Rolling in the Deep",
                "artist": "Adele",
                "image": "adele.jpg",
                "large_image": "images/adele.jpg",
                "year": 2011,
                "pid": 6,
                "media":"songs/adele.mp3",
                "url": "http://www.amazon.co.uk/" 
            }
            
        ] 
    }
    ]};    




describe('mainController', function(){
    var albumRecords = [];
    var scope, $httpBackend,about,labWork;//we'll use this scope in our tests
        beforeEach(function(){
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });
    
    beforeEach(angular.mock.module('angPlayer'));
    beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_){
        //create an empty scope
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/data/dataAudio.json').respond(album);
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('mainController', {$scope: scope});
    }));

    it('should fetch data for albums', function(){
        //expect(scope.albums).toEqualData([]);
        expect(scope.albums).toBeUndefined(); //at this point scope.albums will be undefined...
        $httpBackend.flush(); // after completing the data request now it should be equal to albums..
        expect(scope.albums).toEqualData(album.records);
    });

    // it('should change the location path', function(){
    //     scope.aClicked(1);
    //     expect($location).toBe('/album/1');
    // });

    it('should map routes to controllers', function() {
      inject(function($route) {
        expect($route.routes['/'].templateUrl).
          toEqual('/templates/appView.html');        
        expect($route.routes['/album/:albumId'].templateUrl).
          toEqual('/templates/albumView.html');
        expect($route.routes['/album/:albumId'].controller).
          toEqual('albumController');
        // otherwise redirect to
        expect($route.routes[null].redirectTo).toEqual('/')
      });
    });


});

//test for albumController
describe('albumController', function(){
    var scope, $httpBackend;


        beforeEach(function(){
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });
    
    beforeEach(angular.mock.module('angPlayer'));
    beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_, $routeParams, $filter){
        
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/data/dataAudio.json').respond(album);
        $routeParams.albumId = 1; // setting album id to 1 can be changed..
        scope = $rootScope.$new();
        $controller('albumController', {$scope: scope});
    }));

    //uncomment this test if routeParam got albumid:0;
    // it('should fetch data for sub albums0', function(){ 
    //     expect(scope.subalbum).toBeUndefined(); //at this point scope.albums will be undefined...
    //     $httpBackend.flush(); // after completing the data request now it should be equal to first albums..
    //     expect(scope.subalbum).toEqualData(album.records[0].subalbum);
        
    // });   
    it('should fetch data for sub albums1', function(){
        expect(scope.subalbum).toBeUndefined(); //at this point scope.albums will be undefined...
        $httpBackend.flush(); // after completing the data request now it should be equal to first albums..
        expect(scope.subalbum).toEqualData(album.records[1].subalbum);
    });   
});

describe('kServices tests', function(){
   var player,audioMock;
   beforeEach(module(function($provide) {
    audioMock = {
      src: undefined,
      addEventListener: jasmine.createSpy('addEventListener').andCallFake(
          function(event, fn, capture) {
        expect(event).toBe('ended');
        expect(capture).toBe(false);
        audioMock.endedFn = fn;
      })
    }
    $provide.value('dataProcessor', audioMock);
  }));

    beforeEach(inject(function($injector) {
    player = $injector.get('player');
  }));

  //   it('should initialize the player', function() {
  //   expect(player.data.length).toBe(0);
  //   //expect(player.playing).toBe(false);
  //   //expect(player.current).toEqual(0);
  // });


});     