// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.task', {
    url: '/task',
    views: {
      'tab-task': {
        templateUrl: 'templates/tab-task.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.task.unfinished', {
    url: '/unfinished',
    views: {
      'tab-task-unfinished': {
        templateUrl: 'templates/tab-task-unfinished.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.task.outdated', {
    url: '/outdated',
    views: {
      'tab-task-outdated': {
        templateUrl: 'templates/tab-task-outdated.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.task.finished', {
    url: '/finished',
    views: {
      'tab-task-finished': {
        templateUrl: 'templates/tab-task-finished.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.me', {
    url: '/me',
    views:{
      'tab-me':{
        templateUrl: 'templates/tab-me.html'
      }
    }
  })
  .state('tab.colleague',{
    url: '/colleague',
    views: {
      'tab-me':{
        templateUrl: 'templates/my-colleague.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/task');

});
