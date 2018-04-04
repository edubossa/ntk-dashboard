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
