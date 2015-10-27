import angular from 'angular';
import 'angular-material';
import 'angular-ui-router';
//import 'js-data';
import 'js-data-angular';
import 'angular-bluebird-promises';

const APP_NAME = 'd7';
const app = angular.module(APP_NAME, [
    'ui.router'
    , 'ngMaterial'
    , 'js-data'
    , 'mwl.bluebird'
]);

app.service('GameService', require('./d7-game/service.d7-game'));
app.directive('d7Game', require('./d7-game/directive.d7-game'));
app.directive('d7Selection.light', require('./d7-game/selection/d7-selection.light'));

app.config(['$urlRouterProvider', '$stateProvider', ($urlRouterProvider, $stateProvider) => {
    $stateProvider.state('app', {
        url: ''
        , abstract: true
        , views: {
            'toolbar': {
                template: `
                toolbart?
`
            }
        }
    });

    $urlRouterProvider.otherwise('/home');
}]);

require('./home/config.home');