angular.module('admin.services.dashboard', [])
    .service('dashboardService', ['$log', '$http', '$q', '$window', function($log, $http, $q, $window) {
        $log.debug("- DashboardService LOADED");
        return {
            getTransactions: function(type, tecnologiaId, tecnologiaTipoId) {
                $log.debug("getTransactions type --> " +  type);

                var dataIni  = moment().subtract(30, "days").format('YYYY-MM-DD');
                var dataFim = moment().format('YYYY-MM-DD');

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
                        'dataIni' : '2018-03-01', //dataIni,
                        'dataFim' : '2018-12-31', //dataFim,
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
                    url: 'http://api.payreport.com.br/api/AutoCom/GetTransacaoPorTipo',
                    headers: {
                        'Authorization': 'Basic ZmVpcmFudGsyMDE4QG50ay5jb20uYnI6bnRrMjAxOA==',
                    },
                    params: {
                        'pessoaId': '3504',
                        'tecnologiaId': tecnologiaId,
                        'dataIni' :  '2018-03-01', //dataIni,
                        'dataFim' : '2018-12-31' //dataFim
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
