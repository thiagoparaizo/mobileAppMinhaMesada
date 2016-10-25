angular.module('starter.controllers', [])


.controller('LoginCtrl', function($scope, $rootScope, LoginService, $ionicPopup, $state) {
	$scope.showLoaderLogin = false;
	$scope.showLoaderLoginFacebook = false;
	$scope.showLoaderLoginGoogle = false;
	
	//função para simular href nos botoes
	$scope.go = function ( state ) {
		$state.go(state);
	};
	
	
	$scope.gravarLoginCredentias = function(usuario, token){
		// User is signed in
    	localStorage.setItem("minhamesadaappuserProfile", JSON.stringify(usuario));
    	var userProfileLocal = localStorage.getItem("minhamesadaappuserProfile");
    	$rootScope.userProfile = JSON.parse(userProfileLocal);
    	
    	if(token!=null){
    		localStorage.setItem("minhamesadaappuserProfileToken", JSON.stringify(token));
        	var userProfileTokenLocal = localStorage.getItem("minhamesadaappuserProfileToken");
        	$rootScope.userProfileTokenLocal = JSON.parse(userProfileTokenLocal);
    	}
	}
	
	$scope.login = function(user){
		
		$scope.showLoaderLogin = true;
		
		
		LoginService.loginUser(user).success(function(data) {
			console.log('Login success! Recuperando dados do usuário...');
			
			firebase.auth().onAuthStateChanged(function(userFirebase) {
				    // User is signed in.
					  //3	var userFirebase = firebase.auth().currentUser;
			            if (userFirebase != null) {
			                // User is signed in
			            	$scope.gravarLoginCredentias(userFirebase, null);
			            	
			            	console.log('userFirebase '+ userFirebase);//TODO resolver
			            	console.log('$rootScope.userProfile '+ $rootScope.userProfile);//TODO resolver
			            	
			            	//remover depois
			            	console.log('userFirebase uid:'+ userFirebase.uid);
			            	console.log('userFirebase displayName:'+ userFirebase.displayName);
			            	console.log('userFirebase photoURL:'+ userFirebase.photoURL);
			            	console.log('userFirebase email:'+ userFirebase.email);
			            	console.log('userFirebase emailVerified:'+ userFirebase.emailVerified);
			            	
			            	
			            	userFirebase.providerData.forEach(function (profile) {
			            	    console.log("Sign-in provider: "+profile.providerId);
			            	    console.log("  Provider-specific.UID: "+profile.uid);
			            	    console.log("  Provider.Name: "+profile.displayName);
			            	    console.log("  Provider.Email: "+profile.email);
			            	    console.log("  Provider.Photo URL: "+profile.photoURL);
			            	    
			            	  });
			            	
			            	$state.go('tab.dash');
			            	
			            } else {
			                // No user is signed in
			            	console.log('Não foi possível recuperar as informações do usuário.')
			            }
			    
				});
			
			$scope.showLoaderLogin = false;
			var alertPopup = $ionicPopup.alert({
                title: 'Bem vindo ;)',
                template: 'Tudo certo, vamos começar!'
            });
			
			loadInitInfoDatabase();
			
			$state.go('tab.dash');
			
        }).error(function(data) {
        	console.log('Login error!');
        	$scope.showLoaderLogin = false;
        	var alertPopup = $ionicPopup.alert({
                title: 'Erro no Login :(',
                template: 'Usuário ou senha inválido. Tente novamente.'
            });
        });  
	  }
	
	$rootScope.logout = function(){
		firebase.auth().signOut().then(function() {
			  // Sign-out successful.
			localStorage.setItem("minhamesadaappuserProfile", null);
			localStorage.setItem("minhamesadaappuserProfileToken", null);
			console.log('usuário deslogado!');
			var alertPopup = $ionicPopup.alert({
                title: 'Até mais ;)',
	                template: 'Obrigado, nos vemos em breve!'
	            });
				
				$state.go('login');
			}, function(error) {
			  // An error happened.
			});
	}
	
	$scope.loginForgot = function(user){
		
		LoginService.loginForgot(user).success(function(data) {
			console.log('return loginForgot true');
			var alertPopup = $ionicPopup.alert({
                title: 'Tudo Ok :)',
                template: 'Verifique seu e-mail e siga as intruções para recuperar sua senha.'
            });
			$state.go('login');
			
		}).error(function(data) {
			console.log('return loginForgot false');
			var alertPopup = $ionicPopup.alert({
                title: 'Ops :(',
                template: 'Seu e-mail não foi encontrado. Verifique se digitou corretamente. \nO cadastro é simples e bem rápido, não se preocupe.  '
            });
        });
	}
	
	$scope.loginCreateUser = function(user){
		if(user.password1 != user.password2){
			var alertPopup = $ionicPopup.alert({
                title: 'Ops :(',
                template: 'As senhas digitadas são diferentes. Tente novamente. '
            });
		}else{
			firebase.auth().createUserWithEmailAndPassword(user.email, user.password1).then(function(user) {
			    var user = firebase.auth().currentUser;
			    $scope.gravarLoginCredentias(user, null);
			    console.log('usuario criado...');
			    
			    var alertPopup = $ionicPopup.alert({
	                title: 'Bem Vindo :)',
	                template: 'Conta criada com sucesso! Seja bem vindo!'
	            });
			    $state.go('tab.dash');
			    
			}, function(error) {
				// Handle Errors here.
				  var errorCode = error.code;
				  var errorMessage = error.message;
				  
				  var alertPopup = $ionicPopup.alert({
		                title: 'Ops :(',
		                template: 'Não foi possivel concluir o seu cadastro. Detalhes: ['+errorCode+'] '+errorMessage
		            });
			});
		}
		
	}
	
	//$scope.createUserShow = function(){
	//	$scope.isCreateUserShow = true;
	//}
	
	//$scope.createUserHide = function(){
	//	$scope.isCreateUserShow = false;
	//}
	
	$scope.loginFacebook = function(){
		$scope.showLoaderLoginFacebook = true;
		console.log('Facebook login...0');
		
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_birthday');
		provider.addScope('user_friends');
		provider.addScope('email');
		
		//firebase.auth().signInWithRedirect(provider); //MOBILE - não funciona em desenvolvimento
		//firebase.auth().getRedirectResult().then(function(result) {  //MOBILE - não funciona em desenvolvimento
		
		firebase.auth().signInWithPopup(provider).then(function(result) {  // DEVELOPMENT USE
			var token = null;
			if (result.credential) {
				// This gives you a Facebook Access Token. You can use it to access the Facebook API.
				token = result.credential.accessToken;
		  }
		  // The signed-in user info.
		  var user = result.user;
		  console.log('Facebook login...1');
		  
		  if(user!=null){
			  console.log('Facebook login...2');
			  $scope.showLoaderLoginFacebook = false;
			  $scope.gravarLoginCredentias(user, null);
			  $scope.showLoaderLogin = false;
				
			  var alertPopup = $ionicPopup.alert({
                title: 'Bem vindo ;)',
	                template: 'Tudo certo, vamos começar!'
	            });
				
			  console.log('Facebook login...3');
				loadInitInfoDatabase();
				$state.go('tab.gerenciados');
				
				
		  }
		  
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		 
		  console.log('catch Facebook login: '+ errorCode + ' errorMessage: '+errorMessage);
		  
		  $scope.showLoaderLoginFacebook = false;
		  if('auth/account-exists-with-different-credential'===errorCode){
			  var alertPopup = $ionicPopup.alert({
	              title: 'Erro no Login :(',
	              template: 'Já existe um e-mail cadastrado. Tente entrar com email e senha, ou use a opção \'Esqueci a senha\'.'
	          });
		  }else{
			  var alertPopup = $ionicPopup.alert({
	              title: 'Erro no Login :(',
	              template: 'Não foi possível logar com as informações do Facebook. Tente novamente ou use outra forma de login. ('+errorCode + errorMessage+')'
	          });
		  }
      	
		  
		});
		
		
		
	}
	
	loadInitInfoDatabase = function(){
		
		console.log('loadInitInfoDatabase...');
		var userId = firebase.auth().currentUser.uid;
		console.log('userId: '+ userId);
		
		var retornoUsu = firebase.database().ref('/usuarios_app/'+userId+'/dados_pessoais');
		retornoUsu.on('value', function(snapshot) {
			console.log('..... on retornoUsu');
			$rootScope.dados_pessoais = snapshot.val();
		});
		
		var retornoAux = firebase.database().ref('/usuarios_app/'+userId+'/auxiliar');
		retornoAux.on('value', function(snapshot) {
			console.log('..... on retornoAux');
			$rootScope.auxiliares = snapshot.val();
			
		});
		
		var retornoGer = firebase.database().ref('/usuarios_app/'+userId+'/lista_gerenciados');
		retornoGer.on('value', function(snapshot) {
			console.log('..... on retornoGer');
			$rootScope.gerenciados = snapshot.val();
			
			for (var i = 0; i < $rootScope.gerenciados.length; i++) {
				//console.log('--> '+ JSON.stringify($scope.gerenciados[i], null, 4));
				console.log('--> '+ $rootScope.gerenciados[i].gerenciado.dados_pessoais.birthDate);
			}
		});
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, GerenciadoService) {
  $scope.chat = Chats.get($stateParams.chatId);
  console.log('uid1:'+ $stateParams.chatId);
})

.controller('TesteCtrl', function($scope, TesteService) {
  $scope.teste = {
	  enableTeste: false,
	  testeLabel: "Teste Ionic"
  };
  $scope.userProfile = TesteService.get();
})

.controller('AccountCtrl', function($scope, $rootScope, $state) {
	
	$scope.toggleGroup = function(group) {
	    console.log(group);
		group.show = !group.show;
	  };
	  $scope.isGroupShown = function(group) {
	    return group.show;
	  };
  
}).controller('GerenciadosCtrl', function($scope, $stateParams, GerenciadoService) {
	  console.log('GerenciadosCtrl...');
	  
	  
})
	
.controller('GerenciadoDetailCtrl', function($scope, $stateParams, GerenciadoService) {
	console.log('uid:'+$stateParams.gerenciadoId);
	$scope.gerenciadoAtual = GerenciadoService.get($stateParams.gerenciadoId);
  
  
});
