export default directiveFactory();

function directiveFactory() {
    return [function () {
        return {
            restrict: 'E'
            , scope: {}
            , template: require('./template.d7-game.html')
            , link: link
            , controller: controllerFactory()
            , controllerAs: 'gameCtrl'
            , bindToController: true
        }

    }]
}

function controllerFactory() {
    return ['GameService', function (GameService) {
        this.GameService = GameService;
    }];
}

function link(scope, element, attr, ctrl) {
    let GameService = ctrl.GameService;
    let game = GameService.init(scope, element);

    scope.event = (name, ...args) => {
        game.trigger(name, ...args);
    };

    scope.selection = {};
    game.on('object.selected', (event, type, object) => {
        scope.selection.type = type;
        scope.selection.object = object;
    });
}