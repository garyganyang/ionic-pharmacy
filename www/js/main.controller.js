controllers.controller('MainCtrl', function ($scope, $ionicPopup, $ionicSideMenuDelegate, $ionicPlatform, $state, $location, $rootScope, $sessionStorage, $ionicPopover, StoreService, ionicToast, SaleMountService,loginService,localStorageService,$ionicActionSheet) {
    var vm = this;
    $scope.goReceive = function () {
        var roles = $sessionStorage.roles;//验收员，店长，系统管理员
        if (roles == null) {
            ionicToast.show("请先切换门店", 'bottom', false, 1500);
            return;
        }
        if (roles.indexOf("ROLE_OPERATOR_ACCEPTANCE") > -1 || roles.indexOf("ROLE_OPERATOR_MANAGER") > -1 || roles.indexOf("ROLE_BOSS_SYSTEM") > -1) {
            $state.go("receive");
        } else {
            ionicToast.show("您没有权限进行验收操作", 'bottom', false, 1500);
        }
    };
    $scope.goStockTake = function () {
        var roles = $sessionStorage.roles;//库存管理员，店长，系统管理员
        if (roles == null) {
            ionicToast.show("请先切换门店", 'bottom', false, 1500);
            return;
        }
        if (roles.indexOf("ROLE_OPERATOR_KEEPER") > -1 || roles.indexOf("ROLE_OPERATOR_MANAGER") > -1 || roles.indexOf("ROLE_BOSS_SYSTEM") > -1) {
            $state.go("stock-take");
        } else {
            ionicToast.show("您没有权限进行库存盘点操作", 'bottom', false, 1500);
        }
    };
    $scope.goSale = function (name) {
        var roles = $sessionStorage.roles;//销售员，店长，老板(销售和会员管理权限)
        if (roles == null) {
            ionicToast.show("请先切换门店", 'bottom', false, 1500);
            return;
        }
        if (roles.indexOf("ROLE_OPERATOR_SALESMAN") > -1 || roles.indexOf("ROLE_OPERATOR_MANAGER") > -1 || roles.indexOf("ROLE_BOSS_SYSTEM") > -1) {
            $state.go(name);
        } else {
            ionicToast.show("您没有权限进行此操作", 'bottom', false, 1500);
        }
    };
    $scope.nav = function (name) {
        $state.go(name);
    };

    if ($ionicSideMenuDelegate.isOpenLeft) {
        $ionicSideMenuDelegate.toggleLeft();
    }
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    var codes = [];
    $scope.camera = function () {
        window.BarcodeScanner.multipleScan(function (result) {
            $scope.$apply();
            ionicToast.show(result, 'bottom', false, 1500);
        }, function (e) {
            ionicToast.show(e, 'bottom', false, 1500);
        }, codes);
    };
    var getSale = function () {
        var roles = $sessionStorage.roles;//店长,老板
        if(roles!=null){
            if (roles.indexOf("ROLE_OPERATOR_MANAGER") > -1 || roles.indexOf("ROLE_BOSS_SYSTEM") > -1) {
                $scope.isShow=true;
            }
        }
        SaleMountService.getSale($sessionStorage.token).then(function (res) {
            if (res.data.success) {
                vm.month = res.data.message.currentMonthAmount;
                vm.today = res.data.message.todayAmount;
            } else {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
            }
        })
    };
    var changeStore = function (v) {
        //StoreService.switchStore($sessionStorage.token, v).then(function (res) {
        //    if (res.data.success) {
        //        vm.storeName = res.data.message.store;
        //        $sessionStorage.roles = res.data.message.roles;
        //        getSale();
        //    } else {
        //        ionicToast.show(res.data.message, 'bottom', false, 1500);
        //    }
        //})
       var data = {
           "success": true,
           "message": {
               "enterprise":"九华",
               "store":"天府一街店",
               "roles":[
                   "ROLE_BOSS_SYSTEM",
                   "ROLE_BASIC"
               ]
           }
       };
        vm.storeName = data.message.store;
        $sessionStorage.roles = data.message.roles;
        getSale();

    };
    var getStore = function () {
        //StoreService.getMyStores($sessionStorage.token).then(function (res) {
        //    if (res.data.success) {
        //        $scope.dataList = res.data.message;
        //        var stores= localStorageService.set('stores',$scope.dataList);
        //        changeStore($scope.dataList[0].id);
        //    } else {
        //        ionicToast.show(res.data.message, 'bottom', false, 1500);
        //    }
        //});
        $scope.dataList = [
            {
                "id":1,
                "enterprise":"九华",
                "store":"天府一街店"
            },
            {
                "id":2,
                "enterprise":"九华",
                "store":"总府路店"
            },
            {
                "id":3,
                "enterprise":"九华",
                "store":"双楠店"
            },
            {
                "id":4,
                "enterprise":"九华",
                "store":"牛市口店"
            }
        ];
        var stores= localStorageService.set('stores',$scope.dataList);
        changeStore($scope.dataList[0].id);
    };

    var drugId = localStorageService.get('id');
    if(drugId==''||drugId==null){
        getStore();
    }else{
        changeStore(drugId);
    }
    vm.today = 0;
    vm.month = 0;

    $scope.openModal = function () {
        var list=[];
        var buttons = localStorageService.get('stores');
        angular.forEach(buttons,function(v){
                var button = {
                    text: v.store,
                    storeId: v.id
                };
            list.push(button);
        });
        var hideSheet = $ionicActionSheet.show({
            buttons: list,
            titleText: '选择门店',
            cancelText: '完成',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                angular.forEach(list, function (v, k) {
                    if (index == k) {
                        changeStore(v.storeId);
                        localStorageService.set('id',v.storeId);
                    }
                });
                return true;
            }
        });
    };
    $scope.loginOut=function(){
        loginService.exit($sessionStorage.token).then(function(res){
            if(res.data.success){
                delete $sessionStorage.token;
                delete  $sessionStorage.staff;
                localStorageService.remove('id');
                localStorageService.remove('stores');
                localStorageService.remove('resting');
                localStorageService.remove('drugs');
                ionicToast.show('退出账号成功', 'bottom', false, 1500);
                $state.go('login');
            }else{
                ionicToast.show(res.data.message, false, 1500);
            }
        })
    }
});
