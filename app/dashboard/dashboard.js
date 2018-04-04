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
