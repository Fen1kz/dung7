export default directiveFactory();

function directiveFactory() {
    return [function () {
        return {
            restrict: 'E'
            , scope: {
                selection: '='
            }
            , replace: true
            , template: require('./d7-selection.light.html')
            , controller: controllerFactory()
            , controllerAs: 'selectionCtrl'
            , bindToController: true
        }

    }]
}

function controllerFactory() {
    return ['$scope', 'GameService', function ($scope, GameService) {
        this.GameService = GameService;

        $scope.$watch('selectionCtrl.selection', () => {
            this.object = {
                color: {
                    r: this.selection.color >> 0x10
                    , g: (this.selection.color >> 0x8) % 0x100
                    , b: this.selection.color % 0x100
                }
                , radius: this.selection.radius * 100
                , falloff: this.selection.falloff * 100
            };
        });

        $scope.$watch('selectionCtrl.object', (newValue, oldValue) => {
            if (newValue !== void 0) {
                this.selection.radius = this.object.radius / 100;
                this.selection.falloff = this.object.falloff / 100;
                this.selection.color = (this.object.color.r << 0x10) + (this.object.color.g << 0x8) + this.object.color.b;
                this.selection.trigger('change');
            }
        }, true);
    }];
}