import angular from 'angular';

const app = angular.module('d7');

app.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('app.home', {
        url: '/home'
        , views: {
            'main@': {
                template: `
<d7-game></d7-game>
`
                //template: '<div>asdfsdf</div>'
            }
        }
    });
}]);
