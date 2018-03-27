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
