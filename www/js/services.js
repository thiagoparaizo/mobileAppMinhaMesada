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
	          var loginOK = false;
			  
			  
		      //usuários fictícios que possam ser usados pela página e pra validar o login
		      var usuarios = [{username:'adm', password:'123', admin:true},
		          {username:'Juliano', password:'123', admin:false},
		          {username:'Bruno', password:'123', admin:false}]
		      
		      //Nesse trecho, um for para validar o login
		      angular.forEach(usuarios, function(value, index){
		          if(value.username == user.username &&
		              value.password == user.password){
		              delete value.password;
		              $rootScope.usuarioLogado = value;
		              loginOK = true;
		              deferred.resolve('Welcome ' + name + '!');
		              console.log('login sucesso!');
		             // $location.path('/dash')
		          }
		      })
		      
		      if(!loginOK){
		    	  console.log('erro login!');
		    	  deferred.reject('Wrong credentials.');
		      }
		      
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
			  if(true){//verificar
				  console.log('loginForgot sucesso');
				  return true;
			  }else{ //verificar existencia do usuário
				  console.log('loginForgot erro');
				  return false;
			  }
			  
		  }
		  
	} 
	});

//http://ionicframework.com/docs/components/#header
//CONTROLE DE ACESSO COM ANGULAR-ROUTE - http://www.matera.com/br/2016/04/25/controle-de-acesso-com-angular-route/