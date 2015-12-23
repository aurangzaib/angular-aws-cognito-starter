angular.module('awsStarterApp')
    .factory('AuthService', ['$q', 'ConfigFileLoaderService', function ($q, ConfigFileLoaderService) {
        var AuthService = {};

        AuthService.loginWithFacebook = function (authResponse) {

            var deferred = $q.defer();

            var params;

            ConfigFileLoaderService.load('aws-credentials.json').then(function (success) {
                    console.log("params: " ,success );
                    params = success;
                    console.log("token: ", authResponse.accessToken);
                    params.Logins = {
                        "graph.facebook.com": authResponse.accessToken
                    };
                    AWS.config.region = 'ap-northeast-1';
                    // initialize the Credentials object with our parameters
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
                    console.log(AWS.config.credentials);

                    AWS.config.credentials.get(function (err) {
                        if (!err) {
                            deferred.resolve(AWS.config.credentials.identityId);
                        } else {
                            deferred.reject(err);
                        }
                    });
                }, function (error) {
                    deferred.reject('Problem loading credentials.');
                    return deferred.promise;
                }
            );

            return deferred.promise;
        };

        return AuthService;
    }]).factory('ConfigFileLoaderService', ['$q', '$http', function ($q, $http) {
        var ConfigFileLoaderService = {};

        ConfigFileLoaderService.load = function (file) {
            var deferred = $q.defer();
            $http.get(file).success(function (credentials) {
                deferred.resolve(credentials);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        return ConfigFileLoaderService;
    }])
;