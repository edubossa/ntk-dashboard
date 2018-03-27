'use strict';
angular.module('admin', [
    'ngRoute',
    'admin.dashboard',
    'ngAnimate'
]).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.when('/', {
            redirectTo: '/home'
        }).when('/home', {
        }).when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardViewCtrl'
        }).otherwise({
            templateUrl: 'template/404.html'
        });
    }]).config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(true);
}]).controller('AppCtrl', ['$rootScope', '$scope', '$location', '$window', '$http', '$timeout', '$interval', function($rootScope, $scope, $location, $window, $http, $timeout, $interval) {
    $rootScope.system = {
        "currentTime": moment().locale('pt-br').format('L LTS'),
        "currency": "R$",
        "apiURL": ''
    }
    $rootScope.$on('$locationChangeStart', function(event, next) {
        $location.path("/dashboard");
        $rootScope.system.currentTime = moment().locale('pt-br').format('L LTS');
        // fix when back with model open
        $(".modal-backdrop").remove();
        // clear toastr
        toastr.clear();
    });
    $rootScope.converteGatePrice = function(input, separator) { //OBS: campos separator nao sera mais utilizado
        try {
            if (isNaN(input)) throw 'isNaN';
            var retorno = input / 100;
            var numero = retorno.toFixed(2).split('.');
            numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
            return numero.join(',');
        } catch (err) {
            return '';
        }
    }
    $rootScope.converteDocumento = function(documento) {
        try {
            var documentoFormatado = goodString(documento);
            documentoFormatado = documentoFormatado.replace(/\D/g, "");
            if (documentoFormatado.length == 11) { //caso CPF
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                return documentoFormatado;
            }
            if (documentoFormatado.length == 14) { //caso CNPJ
                documentoFormatado = documentoFormatado.replace(/(\d{2})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1/$2");
                documentoFormatado = documentoFormatado.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
                return documentoFormatado;
            }
            return goodString(documento);
        } catch (err) {
            return documento;
        }
    }
    $rootScope.converteTelefone = function(telefone) {
        try {
            var telefoneFormatado = goodString(telefone);
            telefoneFormatado = telefone.replace(/\D/g, "");
            if (telefoneFormatado.length == 10) { //8 digitos
                telefoneFormatado = telefoneFormatado.replace(/(\d{2})(\d)/, "($1) $2");
                telefoneFormatado = telefoneFormatado.replace(/(\d{4})(\d)/, "$1-$2");
                return telefoneFormatado;
            }
            if (telefoneFormatado.length == 11) { //9 digitos
                telefoneFormatado = telefoneFormatado.replace(/(\d{2})(\d)/, "($1) $2");
                telefoneFormatado = telefoneFormatado.replace(/(\d{5})(\d)/, "$1-$2");
                return telefoneFormatado;
            }
            return goodString(telefone);
        } catch (err) {
            return telefone;
        }
    }
    $rootScope.padZero = function(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }
    $rootScope.moment = function(value) {
        if (value == undefined) return "";
        return moment(value).locale('pt-br').format('L LTS');
    }
    $rootScope.momentDate = function(value) {
        if (value == undefined) return "";
        return moment(value).format('DD/MM/YYYY');
    }
}]).factory('focus', ['$timeout', '$window', function($timeout, $window) {
    return function(id) {
        var element = $window.document.getElementById(id);
        if (element) element.focus();
        $timeout(function() {
            if (element) element.focus();
        }, 500);
    };
}]).directive('eventFocus', ['focus', function(focus) {
    return function(scope, elem, attr) {
        elem.on(attr.eventFocus, function() {
            focus(attr.eventFocusId);
        });
        scope.$on('$destroy', function() {
            elem.off(attr.eventFocus);
        });
    };
}]).filter('sumByKey', function() {
    return function(data, key) {
        if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseInt(data[i][key]);
        }
        return sum;
    };
});
var nodeAuthenticateURL = '/api/authenticate';
'use strict';
angular.module('admin.dashboard', ['ngRoute', 'chart.js', 'admin.services.dashboard'])
    .controller('DashboardViewCtrl', ['$log', '$rootScope', '$scope', 'dashboardService', '$timeout', function($log, $rootScope, $scope, dashboardService, $timeout ) {
    $log.debug("-- DashboardViewCtrl LOADED");

    $scope._isLoadingPagetrTrConciliadas = false;
    $scope._isLoadingPageTrNaoConciliadas = false;
    $scope._isLoadingPageTrEDI = false;
    $scope._isLoadingPageTrAdquirentesTipo = false;

    var tecnologiaIds = '4828321,4828322,4828323,4828324,4828326,4828327,4828328,4828331,4828334,4828335,4828336,4828337,4828339,4828340,4828341,4828342,4828343,4828347';

    var timeout = 2000;

    $scope.trConciliadas = [];
    $scope.trNaoConciliadas = [];
    $scope.trEDI = [];
    $scope.trAdquirentesTipo = [];



    $scope.load = function () {

        //TRANSACOES NAO CONCILIADAS
        $scope._isLoadingPageTrNaoConciliadas = true;
        dashboardService.getTransactions(2, tecnologiaIds).then(function successCallback(data) {
            $scope.trNaoConciliadas = data;

         }, function errorCallback(response) {
            toastr.error("Erro ao carregar as transacoes nao conciliadas");
            console.error("Erro ao carregar as transacoes nao conciliadas");
        }).finally(function() {
            $scope._isLoadingPageTrNaoConciliadas = false;

            $timeout(function() {

                //TRANSACOES CONCILIADAS
                $scope._isLoadingPagetrTrConciliadas = true;
                dashboardService.getTransactions(1, tecnologiaIds).then(function successCallback(data) {
                    $scope.trConciliadas = data;
                }, function errorCallback(response) {
                    toastr.error("Erro ao carregar as transacoes conciliadas");
                    console.error("Erro ao carregar as transacoes conciliadas");
                }).finally(function() {
                    $scope._isLoadingPagetrTrConciliadas = false;

                    $timeout(function() {

                        //TRANSACOES EDI
                        $scope._isLoadingPageTrEDI = true;
                        dashboardService.getTransactions(1, '4828357').then(function successCallback(data) {
                            $scope.trEDI = data;
                        }, function errorCallback(response) {
                            toastr.error("Erro ao carregar as transacoes EDI");
                            console.error("Erro ao carregar as transacoes EDI");
                        }).finally(function() {
                            $scope._isLoadingPageTrEDI = false;

                            $timeout(function() {

                                //TRANSACOES POR ADQUIRENTE E TIPO
                                $scope._isLoadingPageTrAdquirentesTipo = true;
                                dashboardService.getTrAdquirentesTipo(tecnologiaIds).then(function successCallback(data) {
                                    $scope.trAdquirentesTipo = data;
                                }, function errorCallback(response) {
                                    toastr.error("Erro ao carregar as transacoes adquirentes e tipo");
                                    console.error("Erro ao carregar as transacoes adquirentes e tipo");
                                }).finally(function () {
                                    $scope._isLoadingPageTrAdquirentesTipo = false;
                                });

                            }, timeout);

                        });

                    }, timeout);

                });

            }, timeout);

        });


    }

    //polling status
    var statusPollingTime = 1000 * 30;
    var statusPolling = function() {
        //alert("ATUALIZANDO OS DADOS");
        $log.debug("* status polling STARTED");

        $scope.load();


        setTimeout(function() {
            if (typeof statusPolling === "function") statusPolling();
        }, statusPollingTime);

    }

    statusPolling();

    $scope.$on('$destroy', function() {
        statusPolling = null;
    });

    $scope.getDashboardInfo = function (periodo) {
        alert("Periodo -> " +  periodo);
    }


}]);

angular.module('admin.services.dashboard', [])
    .service('dashboardService', ['$log', '$http', '$q', '$window', function($log, $http, $q, $window) {
        $log.debug("- DashboardService LOADED");
        return {
            getTransactions: function(type, tecnologiaId) {
                $log.debug("getTransactions type --> " +  type);

                var dataIni  = moment().subtract(30, "days").format('YYYY-MM-DD');
                var dataFim = moment().format('YYYY-MM-DD');

                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://payreportdemo.ntk.com.br:53680/api/AutoCom/GetTransacaoConciliacaoPorTecnologia',
                    headers: {
                        'Authorization': 'Basic dmljdG9yLmR1YXJ0ZUBudGsuY29tLmJyOnZpY3Rvcg==',
                    },
                    params: {
                        'pessoaId': '3502',
                        'tecnologiaId': tecnologiaId,
                        'tecnologiaTipoId' : '3,4',
                        'dataIni' : dataIni,
                        'dataFim' : dataFim,
                        'conciliada' : type
                    }
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getTrAdquirentesTipo: function(tecnologiaId) {
                $log.debug("getTrAdquirentesTipo");

                var dataIni  = moment().subtract(30, "days").format('YYYY-MM-DD');
                var dataFim = moment().format('YYYY-MM-DD');

                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://payreportdemo.ntk.com.br:53680/api/AutoCom/GetTransacaoPorTipo',
                    headers: {
                        'Authorization': 'Basic dmljdG9yLmR1YXJ0ZUBudGsuY29tLmJyOnZpY3Rvcg==',
                    },
                    params: {
                        'pessoaId': '3502',
                        'tecnologiaId': tecnologiaId,
                        'dataIni' : dataIni,
                        'dataFim' : dataFim
                    }
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            }
        }
}]);
