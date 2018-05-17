angular.module('project', ['restangular', 'ngRoute']).
  config(function($routeProvider, RestangularProvider) {
    $routeProvider.
      when('/', {
        controller:MovieListCtrl,
        templateUrl:'movieList.html'
      }).
      when('/edit/:movieId', {
        controller:MovieEditCtrl,
        templateUrl:'movieDetail.html',
        resolve: {
          movie: function(Restangular, $route) {
            var id = $route.current.params.movieId;
            var title = $route.current.params.movieTitle;
            return Restangular.one('movies', id, title).get();
          }
        }
      }).
      when('/new', {
        controller:MovieCreateCtrl,
        templateUrl:'movieDetail.html'
      }).
      otherwise({redirectTo:'/'});

      RestangularProvider.setBaseUrl('http://localhost:3000/');
  });

function MovieListCtrl($scope, Restangular) {
  $scope.movies = Restangular.all("movies").getList().$object;
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