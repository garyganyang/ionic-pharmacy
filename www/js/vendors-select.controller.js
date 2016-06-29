controllers.controller('vendorsSelectCtrl', function ($scope, $state, $ionicHistory, ionicToast, $sessionStorage, pharmacopoeiaService, $stateParams) {
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('receive', {pharList: $scope.pharList, receivingNote: $scope.receivingNot});

    };
    $scope.receivingNote = {
        vendor: null,
        receivingNo: ''
    };
    $scope.vendors = [];
    $scope.pharList = [];
    $scope.result = [];
    $scope.key = '';
    $scope.$on('$ionicView.enter', function () {
        $scope.pharList = $stateParams.pharList;
        findVendors();
    });
    $scope.searchVendor = function (key) {
        var vendorList = [];
        if (key.trim() == '') {
            $scope.result = $scope.vendors;
            return;
        }
        angular.forEach($scope.vendors, function (data) {
            if (data.name.indexOf(key) > -1) {
                vendorList.push(data);
            }
        });
        $scope.result = vendorList;
    };
    var findVendors = function () {
        pharmacopoeiaService.getVendorList($sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
                return;
            }
            $scope.vendors = res.data.message;
            $scope.result = $scope.vendors;
        });
    };

    $scope.selectVendors = function (vendor) {
        $scope.receivingNote.vendor = vendor;
        $state.go('receive', {pharList: $scope.pharList, receivingNote: $scope.receivingNote});
    };

});
