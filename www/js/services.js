angular.module('starter.services', [])

.factory('Chats', function() {
	// Might use a resource here that returns a JSON array
	  // Some fake testing data
	  var chats = [{
	    id: 0,
	    name: 'Ben Sparrow',
	    lastText: 'You on your way?',
	    face: 'img/ben.png'
	  }, {
	    id: 1,
	    name: 'Max Lynx',
	    lastText: 'Hey, it\'s me',
	    face: 'img/max.png'
	  }, {
	    id: 2,
	    name: 'Adam Bradleyson',
	    lastText: 'I should buy a boat',
	    face: 'img/adam.jpg'
	  }, {
	    id: 3,
	    name: 'Perry Governor',
	    lastText: 'Look at my mukluks!',
	    face: 'img/perry.png'
	  }, {
	    id: 4,
	    name: 'Mike Harrington',
	    lastText: 'This is  wicked good ice cream.',
	    face: 'img/mike.png'
	  }];

	  return {
	    all: function() {
	      return chats;
	    },
	    remove: function(chat) {
	      chats.splice(chats.indexOf(chat), 1);
	    },
	    get: function(chatId) {
	      for (var i = 0; i < chats.length; i++) {
	        if (chats[i].id === parseInt(chatId)) {
	          return chats[i];
	        }
	      }
	      return null;
	    }
	  };
}).factory('TesteService', function() {
	var userProfile = {
		id:1,
		name:'Thiago Paraizo',
		datanascimento: '17-01-1986',
		pontuacaoTotal:2522.5,
		pontuacaoMensal: 12.4,
		valorMesada:50.0
	};
	console.log('aqui...0');
	return {
	    get: function() {
	    	console.log('aqui...');
	      return userProfile;
	    }
	  };
	
	
}).service('LoginService', function ($rootScope, $q) {
	  /*Esta função faz o papel de validação que seria feito no backend */
	return{
		loginUser: function(user){
			  
			  var deferred = $q.defer();
	          var promise = deferred.promise;
	          
	          firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function (result) {
	        	  console.log('usuario logado... ');
		          deferred.resolve('Welcome ');
	        	  
	          }, function (error) {
	        	// Handle Errors here.
	        	  var errorCode = error.code;
	        	  var errorMessage = error.message;
	        	  console.log('erro login!'+ errorCode + ' - ' + errorMessage);
	        	  deferred.reject('Wrong credentials.');
	          });
	          
	          
	          
	          //delete value.password;
	          //console.log('usuario logado... ');
	          //deferred.resolve('Welcome ' + name + '!');
              //console.log('login sucesso!');
              
		      promise.success = function(fn) {
		    	  promise.then(fn);
	              return promise;
	          }
	          promise.error = function(fn) {
	        	  promise.then(null, fn);
	              return promise;
	          }
	          return promise;
		      
		  },
		  
		  logoutUser:function(user){
			  $rootScope.usuarioLogado = null;
		      console.log('logout sucesso!');
		      //impl retorno
		      return null;
		  },
		  
		  loginForgot: function(user){
			  console.log(user);
			  var auth = firebase.auth();
			  var emailAddress = user.email;
			  var deferred = $q.defer();
	          var promise = deferred.promise;

			  auth.sendPasswordResetEmail(emailAddress).then(function() {
				  console.log('loginForgot sucesso');
				  deferred.resolve('loginForgot sucesso');
				  
			  }, function(error) {
			    // An error happened.
				  console.log('loginForgot erro: '+ error);
				  deferred.reject('Wrong credentials.');	
			  });
			  
			  promise.success = function(fn) {
			      promise.then(fn);
			      return promise;
			  }
			  promise.error = function(fn) {
			      promise.then(null, fn);
			      return promise;
			  }
			  return promise;
			  
		  }
		  
	} 
	}).factory('DependenteService', function($rootScope) {
		// Might use a resource here that returns a JSON array
		  // Some fake testing data
		return {
		   get: function(dependenteId) {
			   console.log('DependenteService...');
			   if($rootScope.gerenciados!=null){
				   for (var i = 0; i < $rootScope.gerenciados.length; i++) {
				        if ($rootScope.gerenciados[i].gerenciado.uid === dependenteId) {
				        	console.log('DependenteService... achou');
				        	return $rootScope.gerenciados[i].gerenciado;
				        }
				      }
			   }
			  
		      return null;
		    }
		  };
	}).factory('CahceService', function($rootScope){
		
		//CHAVES - minhamesadaappuserProfile
		//usu_dp = dados pessoais usuário
		//aux_dp = dados pessoais aux
		//dep_dp = dados pessoais dependente
		
		return {
			gravarItemCacheLocal: function(chave, valor){
				try{
					localStorage.setItem(chave, JSON.stringify(valor));
					return true;
				}catch(e){
					console.log(e);
					return false;
				}
			},
			recuperarItemCacheLocal: function(chave){
				try{
					var str = localStorage.getItem(chave);
					if(str){
						return JSON.parse(chave);
					}else{
						return null;
					}
				}catch(e){
					console.log(e);
					return null;
				}
			}, 
			removerItemCacheLocal: function(chave, valor){
				try{
					localStorage.removeItem(chave);
					return true;
				}catch(e){
					console.log(e);
					return false;
				}
			}
			
		}
		
	});

//http://ionicframework.com/docs/components/#header
//CONTROLE DE ACESSO COM ANGULAR-ROUTE - http://www.matera.com/br/2016/04/25/controle-de-acesso-com-angular-route/