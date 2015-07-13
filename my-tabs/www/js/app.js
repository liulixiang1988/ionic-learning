(function(){
app = angular.module('starter', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider.state('home', {
    url: '/home',
    views:{
      'tab-home':{
        templateUrl: 'templates/home.html'
      }
    }
  });
  $stateProvider.state('details', {
    url: '/home/details',
    views:{
      'tab-home':{
        templateUrl: 'templates/details.html'
      }
    }
  });

  $stateProvider.state('settings', {
    url: '/settings',
    views:{
      'tab-settings':{
        templateUrl: 'templates/settings.html'
      }
    }
  });

  $urlRouterProvider.otherwise('/home');
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());
