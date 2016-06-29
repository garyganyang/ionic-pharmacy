controllers.controller('templateCtrl', function ($scope) {
    $scope.fireEvent = function (value) {
        $scope.$emit('template-event', value);
    };
});
