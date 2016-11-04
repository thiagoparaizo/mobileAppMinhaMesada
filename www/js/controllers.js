angular.module('starter.controllers', [])


.directive('clickForOptions', ['$ionicGesture', function($ionicGesture) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $ionicGesture.on('tap', function(e){

                // Grab the content
                var content = element[0].querySelector('.item-content');

                // Grab the buttons and their width
                var buttons = element[0].querySelector('.item-options');

                if (!buttons) {
                    console.log('There are no option buttons');
                    return;
                }
                var buttonsWidth = buttons.offsetWidth;

                ionic.requestAnimationFrame(function() {
                    content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                    if (!buttons.classList.contains('invisible')) {
                        console.log('close');
                        content.style[ionic.CSS.TRANSFORM] = '';
                        setTimeout(function() {
                            buttons.classList.add('invisible');
                        }, 250);                
                    } else {
                        buttons.classList.remove('invisible');
                        content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
                    }
                });     

            }, element);
        }
    };
}])

.controller('LoginCtrl', function($scope, $rootScope, LoginService, $ionicPopup, $ionicLoading, $state, $location, CahceService) {
	$scope.showLoaderLogin = false;
	$scope.showLoaderLoginFacebook = false;
	$scope.showLoaderLoginGoogle = false;
	
	//função para simular href nos botoes
	$scope.go = function ( state ) {
		$state.go(state);
	};
	
	//função para reload
	$scope.goReload = function () {
		$state.go($state.current, {}, {reload: true});
	};
	
	//função para simular href nos botoes
	$scope.locationGo = function ( path ) {
		$location.path(path);
	};
	
	
	
	
	/*$scope.gravarLoginCredentias = function(usuario, token){
		// User is signed in
    	localStorage.setItem("minhamesadaappuserProfile", JSON.stringify(usuario));
    	var userProfileLocal = localStorage.getItem("minhamesadaappuserProfile");
    	$rootScope.userProfile = JSON.parse(userProfileLocal);
    	
    	if(token!=null){
    		localStorage.setItem("minhamesadaappuserProfileToken", JSON.stringify(token));
        	var userProfileTokenLocal = localStorage.getItem("minhamesadaappuserProfileToken");
        	$rootScope.userProfileTokenLocal = JSON.parse(userProfileTokenLocal);
    	}
	}*/
	
	$scope.login = function(user){
		
		$scope.showLoaderLogin = true;
		
		 
		
		
		
		LoginService.loginUser(user).success(function(data) {
			console.log('Login success! Recuperando dados do usuário...');
			
			firebase.auth().onAuthStateChanged(function(userFirebase) {
				    // User is signed in.
					  //3	var userFirebase = firebase.auth().currentUser;
			            if (userFirebase != null) {
			            	console.log('1 Recuperando dados do usuário...');
			            	carregarDadosDB();
			                
			            	//remover depois
			            	//console.log('userFirebase uid:'+ userFirebase.uid);
			            	//console.log('userFirebase displayName:'+ userFirebase.displayName);
			            	//console.log('userFirebase photoURL:'+ userFirebase.photoURL);
			            	//console.log('userFirebase email:'+ userFirebase.email);
			            	//console.log('userFirebase emailVerified:'+ userFirebase.emailVerified);
			            	
			            	
			            	//userFirebase.providerData.forEach(function (profile) {
			            	  //  console.log("Sign-in provider: "+profile.providerId);
			            	   // console.log("  Provider-specific.UID: "+profile.uid);
			            	    //console.log("  Provider.Name: "+profile.displayName);
			            	    //console.log("  Provider.Email: "+profile.email);
			            	    //console.log("  Provider.Photo URL: "+profile.photoURL);
			            	    
			            	  //});
			            	
			            	$state.go('tab.dash');
			            	
			            } else {
			                // No user is signed in
			            	console.log('Não foi possível recuperar as informações do usuário.')
			            }
			    
				});
			$scope.showLoaderLogin = false;
			//rever necessidade
//			$scope.showLoaderLogin = false;
//			var alertPopup = $ionicPopup.alert({
//                title: 'Bem vindo ;)',
//                template: 'Tudo certo, vamos começar!'
//            });
			
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
		var userId = firebase.auth().currentUser.uid;
		
		firebase.auth().signOut().then(function() {
			  // Sign-out successful.
			CahceService.removerItemCacheLocal(userId);
			$rootScope.cahceLocal = null;
			
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
	
	//FUNÇÃO - CRIAR CONTA USUÁRIO (E-MAIL e SENHA)
	$scope.loginCreateAccount = function(user){
		if(user.password1 != user.password2){
			var alertPopup = $ionicPopup.alert({
                title: 'Ops :(',
                template: 'As senhas digitadas são diferentes. Tente novamente. '
            });
		}else{
			
			
			firebase.auth().createUserWithEmailAndPassword(user.email, user.password1).then(function(user2) {
				
				var userFirebase = firebase.auth().currentUser;
			    $scope.gravarLoginCredentias(userFirebase, null);
			    
			    
			    //https://minhamesada-8a570.firebaseio.com/l_usu_app
			    //CRIANDO DADOS USUARIO - DB
			    var dataFormatada = null;
			    try{
			    	dataFormatada= user.birthDate!= null? user.birthDate.toISOString().substring(0, 10): null; //yyyy-MM-dd 2016-10-27
			    }catch(e){}
			    firebase.database().ref('l_usu_app/'+userFirebase.uid).set({
			    	"d_pess": {
			    		"uid" : userFirebase.uid,
					    "displayName" : user.displayName,
					    "email": user.email,
					    "emailVerified" : userFirebase.emailVerified,
					    "photoURL" : dataFormatada,
					    "birthDate" : "",
					    "perfil":"GENITOR"
			    	}
			      }).then(function(){
			    	  console.log('dados do perfildo usuário criado com sucesso...');
			      });
			    
			    
			    var alertPopup = $ionicPopup.alert({
	                title: 'Bem Vindo :)',
	                template: 'Conta criada com sucesso! Seja bem vindo!'
	            });
			    $state.go('tab.dash');
			    
			}, function(error) {
				errorLocal = true;
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
				$state.go('tab.dependentes');
				
				
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
	
	carregarDadosDB = function(){
		$rootScope.show('Carregando Dados...', 15000);
		console.log('1.1 carregarDadosDB - Recuperando dados do usuário...');
		var userId = firebase.auth().currentUser.uid;
		
		var ret = firebase.database().ref('/l_usu_app/'+userId);
		ret.on('value', function(snapshot) {
			console.log('1.2 carregarDadosDB - Recuperando dados do usuário...');
			
			console.log('..... on retornoUsu');
			$rootScope.hide();
			$rootScope.cahceLocal = snapshot.val();
			CahceService.gravarItemCacheLocal(userId, snapshot.val());
		});
		
		/*var retornoAux = firebase.database().ref('/usuarios_app/'+userId+'/auxiliar');
		retornoAux.on('value', function(snapshot) {
			console.log('..... on retornoAux');
			$rootScope.auxiliares = snapshot.val();
			
		});
		
		var retornoGer = firebase.database().ref('/usuarios_app/'+userId+'/l_dep');
		retornoGer.on('value', function(snapshot) {
			console.log('..... on retornoGer');
			$rootScope.dependentes = snapshot.val();
			
			for (var i = 0; $rootScope.dependentes && i < $rootScope.dependentes.length; i++) {
				//console.log('--> '+ JSON.stringify($scope.gerenciados[i], null, 4));
				console.log('--> '+ $rootScope.dependentes[i].dependente.d_pess.birthDate);
			}
		});
		*/
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, DependenteService) {
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

.controller('AccountCtrl', function($scope, $rootScope, $state, CahceService) {
	console.log('load ctrl account...');
	
	$scope.showDadosUsuario = function(){
		if($rootScope.cahceLocal!=null && $rootScope.cahceLocal.d_pess!=null){
			return true;
		}
		return false;
	}
	
	//função para simular href nos botoes
	$scope.go = function ( state ) {
		$state.go(state);
	};
	
	//função para reload
	$scope.goReload = function () {
		console.log('reloading:' );
		$rootScope.cahceLocal.aux = '';
		$state.go($state.current, {}, {reload: true});
	};
  
}).controller('DependentesCtrl', function($scope, $rootScope, $stateParams, $state, $ionicPopup, DependenteService, $ionicPopover) {
	  console.log('DependentesCtrl...');
	  
	  $scope.dep;
	  $scope.addDependente = function(dep){
		  
		  	var userFirebase = firebase.auth().currentUser;
			
		  	var dataFormatada = null;
			try{
			dataFormatada= dep.birthDate!= null? dep.birthDate.toISOString().substring(0, 10): null; //yyyy-MM-dd 2016-10-27
			}catch(e){}
			
			var pushKey = firebase.database().ref('/l_usu_app/'+userFirebase.uid + '/').child('l_dep').push().key;
			
			var postData = {
								"uid" : pushKey,
								"d_pess": {
						    		"uid" : pushKey,
								    "displayName" : dep.displayName,
								    "apelido" : dep.apelido,
								    "email": dep.email,
								    "emailVerified" : userFirebase.emailVerified,
								    "photoURL" : "-",
								    "birthDate" : dataFormatada,
								    "perfil":"DEPENDENTE"
						    	},
								"conectado":false,
								"dt_conectado":"-",
								"dt_desconectado":"-",
								"dt_ultimo_acesso":"-",
								"ref_atv_mensal_key":"-"
							}
			firebase.database().ref('/l_usu_app/'+userFirebase.uid + '/l_dep/'+ pushKey +'/').set(postData).then(function(){
			console.log('dados do dependente criado com sucesso...');
			});
			
			if(!$rootScope.cahceLocal.l_dep){
				$rootScope.cahceLocal.l_dep = [];
				$rootScope.cahceLocal.l_dep.push(postData);
				
			}
			
			var alertPopup = $ionicPopup.alert({
			title: 'Dependente Criado :)',
			template: 'Só mais alguns passos...'
			});
			$state.go('tab.dependentes');
	  }
	  
		 
		  
		  
	  
})
	
.controller('DependenteDetailCtrl', function($scope, $stateParams, $state, DependenteService) {
	console.log('uid:'+$stateParams.dependenteId);
	$scope.depAtual = DependenteService.get($stateParams.dependenteId);
	
	
  
}).controller('AtividadeMensalCtrl', function($scope, $stateParams, $state, $http, $ionicPopover) {
	console.log('ctrl Atividade Mensal');
	
	 
	 $http.get('./js/utils/lista_tarefas_app.json').success(function(data){
		 $scope.atividadesModeloCache = data;
	 });
	console.log('atvsss: '+ JSON.stringify($scope.atividadesModeloCache, null, 4));
	
	 $scope.data = {
			    showDelete: false,
			    showReorder: false
			  };
			  
			  $scope.edit = function(item) {
			    alert('Edit Item: ' + item.id);
			  };
			  $scope.addAtividade = function(item, $event) {
				  console.log('addAtividade...');
				  $scope.popover.show($event);
			  };
			  
			  $scope.moveItem = function(item, fromIndex, toIndex) {
			    $scope.items.splice(fromIndex, 1);
			    $scope.items.splice(toIndex, 0, item);
			  };
			  
			  $scope.onItemDelete = function(item) {
			    $scope.items.splice($scope.items.indexOf(item), 1);
			  };
			  
			  
			  //popover ---
			  $ionicPopover.fromTemplateUrl('popover/atividade.html', {
			      scope: $scope
			   }).then(function(popover) {
			      $scope.popover = popover;
			   });
			  
			  $scope.openPopover = function($event) {
			      $scope.popover.show($event);
			   };

			   $scope.closePopover = function() {
			      $scope.popover.hide();
			   };

			   //Cleanup the popover when we're done with it!
			   $scope.$on('$destroy', function() {
			      $scope.popover.remove();
			   });

			   // Execute action on hide popover
			   $scope.$on('popover.hidden', function() {
			      // Execute action
				   console.log('popover hidden...');
			   });

			   // Execute action on remove popover
			   $scope.$on('popover.removed', function() {
			      // Execute action
				   console.log('popover removed...');
			   });
	
	
});;
