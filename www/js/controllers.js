angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $rootScope, LoginService, $ionicPopup, $state) {
	$rootScope.usuarioLogado = null;
	
	$scope.login = function(user){
		LoginService.loginUser(user).success(function(data) {
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Erro no Login :(',
                template: 'Usuário ou senha inválido. Tente novamente.'
            });
        });  
	  }
	
	$scope.loginForgot = function(user){
		var retorno = LoginService.loginForgot(user);
		if(retorno){
			var alertPopup = $ionicPopup.alert({
                title: 'Tudo Ok :)',
                template: 'Verifique seu e-mail e siga as intruções para recuperar sua senha.'
            });
			$state.go('login');
		}else{
			var alertPopup = $ionicPopup.alert({
                title: 'Ops :(',
                template: 'Seu e-mail não foi encontrado. Verifique se digitou corretamente. \nO cadastro é simples e bem rápido, não se preocupe.  '
            });
		}
	}
	
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('TesteCtrl', function($scope, TesteService) {
  $scope.teste = {
	  enableTeste: false,
	  testeLabel: "Teste Ionic"
  };
  $scope.userProfile = TesteService.get();
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends:true
	}
  
});
