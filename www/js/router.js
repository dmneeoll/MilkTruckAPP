/**
 * Created by DMNeeoll on 2016/3/22.
 */
/**
 * 路由
 */
angular.module('milktruckAPP.router', [])
    .config(['$provide', '$stateProvider', '$urlRouterProvider', function ($provide, $stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('signin', {
                url: '/signin',
                cache:false,
                templateUrl: 'templates/loging.html',
                controller: 'AppCtrl'
            })

            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tab.home', {
                url: '/home',
                views: {
                    'home': {
                        templateUrl: 'templates/tab-home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            .state('BandingCarNo', {
                url: '/BandingCarNo',
                cache:false,
                templateUrl: 'templates/bandingCarNo.html',
                controller: 'BandingCarNoCtrl'
            })


        $urlRouterProvider.otherwise('signin');

    }])