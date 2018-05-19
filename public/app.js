angular.module('project', ['restangular', 'ngRoute']).
  config(function($routeProvider, RestangularProvider) {
    $routeProvider.
      when('/', {
        controller:MovieListCtrl,
        templateUrl:'movieList.html'
      }).
      when('/edit/:movieId', {
        controller:MovieEditCtrl,
        templateUrl:'movieEdit.html',
        resolve: {
          movie: function(Restangular, $route) {
            var id = $route.current.params.movieId;
            return Restangular.one('movies', id).get();
          }
        }
      }).
      when('/new', {
        controller:MovieCreateCtrl,
        templateUrl:'movieNew.html'
      }).
      when('/view/:movieId', {
        controller:MovieViewCtrl,
        templateUrl:'movieView.html',
        resolve: {
          movie: function(Restangular, $route) {
            var id = $route.current.params.movieId;
            return Restangular.one('movies', id).get();
          }
        }
      }).
      otherwise({redirectTo:'/'});

      RestangularProvider.setBaseUrl('http://localhost:3000/');
  });

function MovieListCtrl($scope, Restangular) {
  $scope.movies = Restangular.all("movies").getList().$object;
}

function MovieViewCtrl($scope, $location, Restangular, movie) { 
    $scope.movie = movie;
  }

function MovieCreateCtrl($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('movies')
      .post($scope.movie)
      .then(function(movie) {
        $location.path('/list');
    });
  }
}

function MovieEditCtrl($scope, $location, Restangular, movie) {
  var original = movie;
  $scope.movie = Restangular.copy(original);

  $scope.destroy = function() {
    original.remove().then(function() {
      $location.path('/list');
    });
  };

  $scope.save = function() {
    $scope.movie.put().then(function() {
      $location.path('/');
    });
  };
}