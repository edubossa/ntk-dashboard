'use strict';
angular.module('admin.dashboard', ['ngRoute', 'chart.js', 'admin.services.dashboard'])
    .controller('DashboardViewCtrl', ['$log', '$rootScope', '$scope', 'dashboardService', function($log, $rootScope, $scope, dashboardService ) {
    $log.debug("-- DashboardViewCtrl LOADED");

    $scope._isLoadingPage = false;

    /*$scope.reports_conciliadas = [
        {
            "id" : 121,
            "title" : "Venda 01",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 122,
            "title" : "Venda 02",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 123,
            "title" : "Venda 03",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 124,
            "title" : "Venda 04",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 125,
            "title" : "Venda 05",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 126,
            "title" : "Venda 06",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 127,
            "title" : "Venda 07",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 128,
            "title" : "Venda 08",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 129,
            "title" : "Venda 09",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 130,
            "title" : "Venda 10",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        }
    ];*/

    $scope.reports_conciliadas = [];

    $scope.load = function () {

        $scope._isLoadingPage = true;
        dashboardService.getTransactions('C').then(function successCallback(data) {
            $scope.reports_conciliadas = data;

         }, function errorCallback(response) {
            toastr.error("Erro ao carregar as transacoes");
            console.error("Erro ao carregar as transacoes");
        }).finally(function() {
            $scope._isLoadingPage = false;
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
