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

    var tecnologiaIds = '4828327, 4828328, 4828335, 4828337, 4828339, 4828340, 4828342, 4828343, 4828347, 4828350, 4828351, 4828353, 4828354, 4828377, 4828378, 4828379, 4828361';

    var timeout = 2000;

    $scope.trConciliadas = [];
    $scope.trNaoConciliadas = [];
    $scope.trEDI = [];
    $scope.trAdquirentesTipo = [];


    //--------------------------------------------------------------------//
    google.charts.load('current', {'packages':['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawBarColors);

    function drawBarColors() {
        var title = [];
        var value = [];
        title.push('');
        value.push('')
        $scope.trAdquirentesTipo.forEach(function (item) {
            title.push(item.operacao_Nome);
            var temp = item.valorBruto_Total.replace(".", "").replace(",", "");
            value.push (parseInt(temp) / 100);
        });

        var data = google.visualization.arrayToDataTable([
            title,
            value
        ]);

        var options = {
            title: 'Valor transações por tipo',
            titleTextStyle: {
                color: '#0a68b4',    // any HTML string color ('red', '#cc00cc')
                fontSize: 22, // 12, 18 whatever you want (don't specify px)
                bold: true,    // true or false
                italic: false
            },
            chartArea: {width: '50%'}

        };
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
    //--------------------------------------------------------------------//

     function loadBandeira(bandeiras) {
         for(var i = 0; i< bandeiras.length; i++) {
             switch (bandeiras[i].bandeira_Nome) {
                 case 'MASTERCARD' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/mastercard.png";
                     break;
                 case 'VISA' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/visa.png";
                     break;
                 case 'MAESTRO' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/mastercard%20maestro.png";
                     break;
                 case 'DINERS' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/diners.png";
                     break;
                 case 'AMEX' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/amex.png";
                     break;
                 case 'VISA Electron' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/visa%20electron.png";
                     break;
                 case 'HIPERCARD' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/hipercard.png";
                     break;
                 case 'Hiper' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/hiper.png";
                     break;
                 case 'ELO' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/elo.png";
                     break;
                 case 'DISCOVER' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/discover.png";
                     break;
                 case 'AURA' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/aura.png";
                     break;
                 case 'BANESE CARD' :
                     bandeiras[i].url_bandeira = "https://gate.2all.com.br/catalog/view/theme/default/images/banesecard.png";
                     break;
                 default :
                     bandeiras[i].url_bandeira = "";
             }


         }
     }

    $scope.load = function () {

        //TRANSACOES NAO CONCILIADAS
        $scope._isLoadingPageTrNaoConciliadas = true;
        dashboardService.getTransactions(2, tecnologiaIds, '3,4').then(function successCallback(data) {
            $scope.trNaoConciliadas = data;
            loadBandeira($scope.trNaoConciliadas);
         }, function errorCallback(response) {
            toastr.error("Erro ao carregar as transacoes nao conciliadas");
            console.error("Erro ao carregar as transacoes nao conciliadas");
        }).finally(function() {
            $scope._isLoadingPageTrNaoConciliadas = false;

            $timeout(function() {

                //TRANSACOES CONCILIADAS
                $scope._isLoadingPagetrTrConciliadas = true;
                dashboardService.getTransactions(1, tecnologiaIds, '3,4').then(function successCallback(data) {
                    $scope.trConciliadas = data;
                    loadBandeira($scope.trConciliadas);
                }, function errorCallback(response) {
                    toastr.error("Erro ao carregar as transacoes conciliadas");
                    console.error("Erro ao carregar as transacoes conciliadas");
                }).finally(function() {
                    $scope._isLoadingPagetrTrConciliadas = false;

                    $timeout(function() {

                        //TRANSACOES EDI
                        $scope._isLoadingPageTrEDI = true;
                        dashboardService.getTransactions(1, '4828336, 4828341, 4828352, 4828357,4828334,4828331,4828326,4828324,4828323,4828322,4828321', '3,4').then(function successCallback(data) {
                            $scope.trEDI = data;
                            loadBandeira($scope.trEDI);
                        }, function errorCallback(response) {
                            toastr.error("Erro ao carregar as transacoes EDI");
                            console.error("Erro ao carregar as transacoes EDI");
                        }).finally(function() {
                            $scope._isLoadingPageTrEDI = false;

                            $timeout(function() {

                                //TRANSACOES POR ADQUIRENTE E TIPO
                                $scope._isLoadingPageTrAdquirentesTipo = true;
                                dashboardService.getTrAdquirentesTipo('4828321, 4828327, 4828328, 4828331, 4828335, 4828337, 4828339, 4828340, 4828342, 4828343, 4828347, 4828350, 4828351, 4828353, 4828354, 4828357, 4828336, 4828341, 4828352, 4828377, 4828378, 4828379, 4828361, 4828357,4828334,4828331,4828326,4828324,4828323,4828322,4828321').then(function successCallback(data) {
                                    $scope.trAdquirentesTipo = data;
                                }, function errorCallback(response) {
                                    toastr.error("Erro ao carregar as transacoes adquirentes e tipo");
                                    console.error("Erro ao carregar as transacoes adquirentes e tipo");
                                }).finally(function () {
                                    $scope._isLoadingPageTrAdquirentesTipo = false;
                                    drawBarColors();
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


    $scope.enabledGraphic = true;
    $scope.sendEnabledGraphic = function() {
        $scope.enabledGraphic = !$scope.enabledGraphic;
    }


}]);

angular.module('admin.services.dashboard', [])
    .service('dashboardService', ['$log', '$http', '$q', '$window', function($log, $http, $q, $window) {
        $log.debug("- DashboardService LOADED");
        return {
            getTransactions: function(type, tecnologiaId, tecnologiaTipoId) {
                $log.debug("getTransactions type --> " +  type);

                var dataIni  = moment().format('YYYY-MM-DD');
                var dataFim = moment().add(1, "days").format('YYYY-MM-DD');

                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://api.payreport.com.br/api/AutoCom/GetTransacaoConciliacaoPorTecnologia',
                    headers: {
                        'Authorization': 'Basic ZmVpcmFudGsyMDE4QG50ay5jb20uYnI6bnRrMjAxOA=='
                    },
                    params: {
                        'pessoaId': '3504',
                        'tecnologiaId': tecnologiaId,
                        'tecnologiaTipoId' : tecnologiaTipoId,
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

                var dataIni  = moment().format('YYYY-MM-DD');
                var dataFim = moment().add(1, "days").format('YYYY-MM-DD');

                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://api.payreport.com.br/api/AutoCom/GetTransacaoPorTipo',
                    headers: {
                        'Authorization': 'Basic ZmVpcmFudGsyMDE4QG50ay5jb20uYnI6bnRrMjAxOA==',
                    },
                    params: {
                        'pessoaId': '3504',
                        'tecnologiaId': tecnologiaId,
                        'dataIni' :  dataIni,
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
