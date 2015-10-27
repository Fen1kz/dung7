export default directiveFactory();

function directiveFactory() {
    return [function () {
        return {
            restrict: 'E'
            , scope: {
                selection: '='
            }
            , template: require('./d7-selection.light.html')
            , controller: controllerFactory()
            , controllerAs: 'selectionCtrl'
            , bindToController: true
        }

    }]
}

function controllerFactory() {
    return ['GameService', function (GameService) {
        this.GameService = GameService;

        console.log('hai')
    }];
}