controllers.controller('scannerByBlueToothCtrl', function ($scope, $state, $ionicActionSheet, $stateParams, $sessionStorage, $document) {
        if (angular.isUndefined($sessionStorage.token)) {
            $state.go('login');
        }
        $scope.back = function () {
            $state.go('add-manually', {pharList: $scope.pharList, isModify: $scope.isModify, drugNote: $scope.drugNote});
        };
        $scope.items = [];
        $scope.drugNote = {};
        $scope.pharList = [];
        $scope.$on('$ionicView.enter', function () {
            $scope.pharList = $stateParams.pharList;
            $scope.drugNote = $stateParams.drugNote;
            $scope.isModify = $stateParams.isModify;
            $scope.items = $stateParams.drugNote.escodes;
        });
        $scope.submit = function () {
            $scope.drugNote.escodes = $scope.items;
            $state.go('add-manually', {pharList: $scope.pharList, isModify: $scope.isModify, drugNote: $scope.drugNote});
        };
        $scope.onItemDelete = function (item) {
            $scope.items.remove(item);
        };
        $scope.x = {code: ''};
        $scope.updateShowItem = function () {
            var showItem = [];
            var length = $scope.items.length;
            if (length >= 3) {
                showItem = [
                    $scope.items[length - 1],
                    $scope.items[length - 2],
                    $scope.items[length - 3]
                ];
            } else {
                showItem = $scope.items;
            }
            return showItem;
        };
        $scope.clear = function () {
            $scope.x.code = '';
        };
        $scope.$watch(function () {
            return $scope.x.code;
        }, function (value) {
            var re = /^\d{20}$/;
            var re1 = /^\d+$/;
            if (re.test(value)) {
                $scope.items.add(value);
                $scope.x.code = '';
            } else {
                if (!re1.test(value)) {
                    $scope.x.code = '';
                }
            }
        });
    }
);
