// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module (also set in a <body> attribute in index.html)
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'onezone-datepicker', 'ionic-toast', 'ngStorage', 'LocalStorageModule'])
  .constant('restUrl', 'http://app.jianfukeji.local/api/').constant('updateUrl', 'http://192.168.5.112/version.xml').constant('moment', moment)

    .run(function ($ionicPlatform, $rootScope, $ionicPopup, $ionicHistory, $timeout, ionicToast, $location, updateUrl) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(false);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            window.addEventListener('native.keyboardshow', function () {
                var bar = document.querySelector('ion-footer-bar');
                if (bar != null) {
                    angular.element(bar).css('display', 'none');
                }
            });
            window.addEventListener('native.keyboardhide', function () {
                var bar = document.querySelector('ion-footer-bar');
                if (bar != null) {
                    angular.element(bar).css('display', '');
                }
            });
            window.AppUpdate.checkAppUpdate(function () {
            }, function () {
            }, updateUrl);
        });
        $ionicPlatform.registerBackButtonAction(function (e) {

            if ($rootScope.backButtonPressedOnceToExit) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '<strong>退出应用?</strong>',
                    template: '你确定要退出应用吗?',
                    buttons: [
                        {
                            text: '<span >是</span>', onTap: function () {
                            ionic.Platform.exitApp();
                        }
                        }, {
                            text: '否', onTap: function () {
                                $rootScope.backButtonPressedOnceToExit = false;
                                $timeout.cancel($rootScope.timer);
                            }
                        }
                    ]
                });
            } else {
                ionicToast.show('再按一次退出系统', 'bottom', false, 1000);
                $rootScope.backButtonPressedOnceToExit = true;
                $rootScope.timer = setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
    })

    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    })

    .config(['$provide', function ($provide) {
        $provide.decorator('$locale', ['$delegate', function ($delegate) {
            if ($delegate.id == 'en-us') {
                $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
                $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
            }
            return $delegate;
        }]);
    }])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main',
                cache: false
            })
            .state('receive', {
                url: '/receive',
                templateUrl: 'templates/receive.html',
                params: {pharList: null, receivingNote: null},
                cache: false,
                controller: 'receiveCtrl'
            })
            .state('warehouse-in', {
                url: '/warehouse-in',
                cache: false,
                templateUrl: 'templates/warehouse-in.html',
                params: {receivingNote: null, noteDetail: null},
                controller: 'warehouseInCtrl'
            })
            .state('receiving-note', {
                url: 'receiving-note',
                cache: false,
                templateUrl: 'templates/receiving-note.html',
                params: {receivingNote: null},
                controller: 'receivingNoteCtrl'
            })
            .state('warehouse', {
                url: '/warehouse',
                cache: false,
                templateUrl: 'templates/warehouse.html',
                params: {receivingNote: null, noteDetail: null},
                controller: 'warehouseCtrl'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'settingsCtrl'
            })
            .state('version', {
                url: '/version',
                templateUrl: 'templates/version.html',
                controller: 'versionCtrl'
            })
            .state('add-manually', {
                url: '/add-manually',
                templateUrl: 'templates/add-manually.html',
                params: {pharList: null, receivingNote: null, isModify: false, drugNote: null},
                cache: false,
                controller: 'addManuallyCtrl'
            })
            .state('scanner-bluetooth', {
                url: '/scanner-bluetooth',
                templateUrl: 'templates/scanner-bluetooth.html',
                params: {pharList: null, isModify: false, drugNote: null},
                cache: false,
                controller: 'scannerByBlueToothCtrl'
            })
            .state('purchase-note', {
                url: '/purchase-note',
                templateUrl: 'templates/purchase-note.html',
                controller: 'purchaseNoteCtrl'
            })
            .state('vendors-select', {
                url: '/vendors-select',
                params: {pharList: null},
                cache: false,
                templateUrl: 'templates/vendors-select.html',
                controller: 'vendorsSelectCtrl'
            })
            .state('logistics-note', {
                url: '/logistics-note',
                templateUrl: 'templates/logistics-note.html',
                controller: 'logisticsNoteCtrl'
            })
            .state('stock-take', {
                url: '/stock-take',
                templateUrl: 'templates/stock-take.html',
                controller: 'StockTakeCtrl',
                controllerAs: 'stock'
            })
            .state('change-key', {
                url: '/change-key',
                templateUrl: 'templates/change-key.html',
                controller: 'ChangeKeyCtrl',
                cache: false,
                controllerAs: 'key'
            })
            .state('feedback', {
                url: '/feedback',
                templateUrl: 'templates/feedback.html',
                controller: 'FeedbackCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl'
            })
            .state('sale', {
                url: '/sale',
                templateUrl: 'templates/sale.html',
                controller: 'SaleCtrl',
                controllerAs: 'sale',
                params: {
                    obj: null
                },
                cache: false
            })
            .state('sale-choose-member', {
                url: '/sale-choose-member',
                cache:false,
                templateUrl: 'templates/sale-choose-member.html',
                controller: 'ScmCtrl',
                controllerAs: 'scm'
            })
            .state('sale-lading-bill', {
                url: '/sale-lading-bill',
                templateUrl: 'templates/sale-lading-bill.html',
                controller: 'SlbCtrl',
                controllerAs: 'slb',
                cache:false
            })
            .state('sale-add-goods', {
                url: '/sale-add-goods',
                templateUrl: 'templates/sale-add-goods.html',
                params: {
                    obj: null
                },
                cache: false,
                controller: 'SaleAddGoodsCtrl',
                controllerAs: 'sag'
            })
            .state('sale-search-goods', {
                url: '/sale-search-goods',
                templateUrl: 'templates/sale-search-goods.html',
                params: {
                    obj: null
                },
                cache: false,
                controller: 'SaleSearchGoodsCtrl',
                controllerAs: 'ssg'
            })
            .state('sale-settle-accounts', {
                url: '/sale-add-goods',
                templateUrl: 'templates/sale-settle-accounts.html',
                params: {realPrice: null},
                cache: false,
                controller: 'SaleSettleAccountsCtrl',
                controllerAs: 'ssa'
            })
            .state('sale-goods-list', {
                url: '/sale-goods-list',
                templateUrl: 'templates/sale-goods-list.html',
                params: {
                    obj: null
                },
                cache: false,
                controller: 'SaleGoodsListCtrl',
                controllerAs: 'sgl'
            })
            .state('member', {
                url: '/member',
                cache: false,
                templateUrl: 'templates/member.html',
                controller: 'MemberCtrl',
                controllerAs: 'me'
            })
            .state('member-detail', {
                url: '/member-detail',
                params: {list: null},
                cache: false,
                templateUrl: 'templates/member-detail.html',
                controller: 'MemberDetailCtrl',
                controllerAs: 'mdc'
            })
            .state('change-member', {
                url: '/change-member',
                params: {list: null},
                cache: false,
                templateUrl: 'templates/change-member.html',
                controller: 'ChangeMemberCtrl',
                controllerAs: 'cmc'
            });
        $urlRouterProvider.otherwise('/login');
    });
