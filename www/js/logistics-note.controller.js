controllers.controller('logisticsNoteCtrl', function ($scope, $stateParams, $state, $sessionStorage) {
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }

    $scope.back = function () {
        $state.go('purchase-note');
    };
    $scope.selectLogistics = function (note) {
        $state.go('receive', {logisticsNote: note});
    };

    $scope.logisticsNotes = [{
        "id": 445522552255,
        "enterprise": 4,
        "count": 30

    }, {
        "id": 445522552255,
        "enterprise": 4,
        "count": 30

    }, {
        "id": 445522552255,
        "enterprise": 4,
        "drugCount": 30

    }, {
        "id": 445522552255,
        "enterprise": 4,
        "drugCount": 30

    }, {
        "id": 445522552255,
        "enterprise": 4,
        "drugCount": 30

    }];
});
