controllers.controller('addManuallyCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $filter, moment, $ionicPopup, pharmacopoeiaService, ionicToast, $sessionStorage) {
    $scope.show = false;
    $scope.drugNote = {
        id: null,
        code: '',
        brand: '',
        name: '',
        specifications: '',
        pictureUrl: '',
        producer: '',
        licenseNo: '',
        needIDCard: '',
        dosageForm: '',
        barcode: '',
        batchCodeId: null,
        batchCode: '',
        produceDay: '',
        expireDay: '',
        purchasePrice: null,
        receivingCount: null,
        failedCount: null,
        failedOperation: '退货处理'
    };

    $scope.isModify = false;
    $scope.drug = {
        code: ''
    };
    $scope.isGoOn = false;
    $scope.receivingNote = {};
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('receive', {pharList: $scope.pharList, receivingNote: $scope.receivingNote});
    };
    $scope.pharList = [];
    $scope.vendor = {};
    $scope.$on('$ionicView.enter', function () {
        var drugNote = {};
        $scope.drug.code = '';
        $scope.pharList = $stateParams.pharList;
        $scope.isCache =$stateParams.isCache;
        $scope.receivingNote = $stateParams.receivingNote;
        drugNote = $stateParams.drugNote;
        $scope.isModify = $stateParams.isModify;

        if ($scope.pharList == null) {
            $scope.pharList = [];
            return;
        }
        if (drugNote != null) {
            $scope.drugNote = drugNote;
        }
        if ($scope.isModify) {
            findBatchCode();
            $scope.drug.code = $scope.drugNote.code;
            $scope.show = true;
        }
    });

    $scope.findProductMessage = function (code) {
        if (code != null || code.trim != '') {
            pharmacopoeiaService.getByBarCode(code, $sessionStorage.token).then(function (res) {
                if (!res.data.success) {
                    ionicToast.show(res.data.message, 'bottom', false, 1500);
                    $scope.drugNote = {};
                    $scope.show = false;
                    return;
                }
                if (res.data.message.length == 0) {
                    ionicToast.show('未查询到该编码对应的药品信息', 'bottom', false, 1500);
                    return;
                }
                $scope.drugMessages = res.data.message;
                setProductMessage($scope.drugMessages);
                findBatchCode();
            });
        }
    };

    var setProductMessage = function (drug) {
        $scope.drugNote.id = drug.id;
        $scope.drugNote.code = drug.code;
        $scope.drugNote.brand = drug.brand;
        $scope.drugNote.name = drug.name;
        $scope.drugNote.specifications = drug.specifications;
        $scope.drugNote.pictureUrl = drug.pictureUrl;
        $scope.drugNote.producer = drug.producer;
        $scope.drugNote.licenseNo = drug.licenseNo;
        $scope.drugNote.needIDCard = drug.needIDCard;
        $scope.drugNote.dosageForm = drug.dosageForm;
        $scope.drugNote.failedOperation = '退货处理';
        $scope.drugNote.failedCount = 0;
        $scope.show = true;
    };

    $scope.batchCodes = [];

    /*查找商品批号*/
    var findBatchCode = function () {
        $scope.batchCodes = [];
        if ($scope.drugNote.id == null) {
            ionicToast.show("请先选择商品", 'bottom', false, 1500);
            return;
        }
        pharmacopoeiaService.getBatchCode($scope.drugNote.id, $sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                return;
            }
            $scope.batchCodes = res.data.message;
        });
    };

    /*选择批号*/
    $scope.selectBatchCode = function () {
        $scope.drugNote.batchCodeId = null;
        $scope.drugNote.produceDay = '';
        $scope.drugNote.expireDay = '';
        angular.forEach($scope.batchCodes, function (data) {
            if ($scope.drugNote.batchCode == data.code) {
                $scope.drugNote.batchCodeId = data.id;
                $scope.drugNote.produceDay = data.produceDate;
                $scope.drugNote.expireDay = data.expireDate;
            }
        });
    };

    /*扫描条码*/
    $scope.cameraBarcode = function () {
        window.BarcodeScanner.singleScan(function (result) {
            $scope.$apply();
            $scope.drugNote.barcode = result;
            $scope.drug.code = result;
            $scope.findProductMessage(result);
        }, function (e) {
            ionicToast.show(e, 'bottom', false, 1500);
        });
    };

    /*盘点完成*/
    $scope.submit = function () {
        if (isEmpty($scope.drugNote.batchCode)) {
            warn();
            return;
        }
        if($scope.drugNote.receivingCount==null){
            warn();
            return;
        }
        if ($scope.drugNote.produceDay == null) {
            warn();
            return;
        }
        if ($scope.drugNote.expireDay == null) {
            warn();
            return;
        }
        if (!isPrice($scope.drugNote.purchasePrice)) {
            warn();
            return;
        }
        if (!isDigit($scope.drugNote.failedCount)) {
            warn();
            return;
        }
        if (isEmpty($scope.drugNote.failedOperation)) {
            warn();
            return;
        }
        if (!$scope.isModify) {
            $scope.pharList.add($scope.drugNote);
        }
        $state.go('receive', {pharList: $scope.pharList, receivingNote: $scope.receivingNote});
    };

    /*继续盘点*/
    $scope.goOnAdd = function () {
        if (isEmpty($scope.drugNote.batchCode)) {
            warn();
            return;
        }
        if($scope.drugNote.receivingCount==null){
            warn();
            return;
        }
        if ($scope.drugNote.produceDay == null) {
            warn();
            return;
        }
        if ($scope.drugNote.expireDay == null) {
            warn();
            return;
        }
        if (!isPrice($scope.drugNote.purchasePrice)) {
            warn();
            return;
        }
        if (!isDigit($scope.drugNote.failedCount)) {
            warn();
            return;
        }
        if (isEmpty($scope.drugNote.failedOperation)) {
            warn();
            return;
        }
        if (!$scope.isModify) {
            $scope.pharList.add($scope.drugNote);
        }
        $scope.drugNote = {};
        $scope.drug.code = '';

        $scope.show = false;
    };

    $scope.formatDate = function (date, type) {
        if (!(moment(date, 'YYYYMMDD').isValid() || moment(date, 'YYYYMM').isValid())) {
            ionicToast.show('日期格式不正确', 'bottom', false, 1500);
            return;
        }
        if (date.length == 8) {
            date = moment(date, 'YYYYMMDD').format('YYYY-MM-DD');

        } else if (date.length == 6) {
            date = moment(date, 'YYYYMM').format('YYYY-MM');
        }

        if (type == 'PRODUCE_DAY') {
            $scope.drugNote.produceDay = date;
        } else if (type = 'EXPIRE_DAY') {
            $scope.drugNote.expireDay = date;
        }
    };

    var warn = function () {
        $ionicPopup.show({
            title: '<div class="popup-img"><img  src="img/warn.png" ><span>请补全资料</span></div>',
            buttons: [
                {
                    text: '确定', onTap: function () {
                }
                }
            ]
        });
    };
});
