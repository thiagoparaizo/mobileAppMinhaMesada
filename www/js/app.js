// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.utildb', 'ngCordova', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.gerenciados', {
      url: '/gerenciados',
      views: {
        'tab-gerenciados': {
          templateUrl: 'templates/gerenciados.html',
          controller: 'GerenciadosCtrl'
        }
      }
    }).state('tab.gerenciado-detail', {
	      url: '/gerenciados/:gerenciadoId',
	      views: {
	        'tab-gerenciados': {
	          templateUrl: 'templates/gerenciado-detail.html',
	          controller: 'GerenciadoDetailCtrl'
	        }
	      }
	    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.teste', {
	    url: '/teste',
	    views: {
	      'tab-teste': {
	        templateUrl: 'templates/tab-teste.html',
	        controller: 'TesteCtrl'
	      }
	    }
	  })
	  .state('tab.account', {
	    url: '/account',
	    views: {
	      'tab-account': {
	        templateUrl: 'templates/tab-account.html',
	        controller: 'AccountCtrl'
	      }
	    }
	  });
  
  //páginas/views foras das regras de TAB
  $stateProvider
	  .state('login', {
	      url: '/login',
	      templateUrl: 'templates/login.html',
	      controller: 'LoginCtrl'
	  })
	  .state('login-forgot', {
	      url: '/login-forgot',
	      templateUrl: 'templates/login-forgot.html',
	      controller: 'LoginCtrl'
	  })
	  .state('login-createaccount', {
	      url: '/login-createaccount',
	      templateUrl: 'templates/login-createaccount.html',
	      controller: 'LoginCtrl'
	  })
	  .state('welcome', {
	      url: '/login',
	      templateUrl: 'templates/login.html',
	      controller: 'LoginCtrl'
	});
 
  
  
  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})
.run(function ($rootScope, $location) {
 console.log('run...');
 $rootScope.userProfile = localStorage.getItem("minhamesadaappuserProfile"); 
  //Rotas que necessitam do login
 
  var rotasLiberadasUsuariosNaoLogados = ['/login', '/login-createaccount', '/login-forgot', '/welcome'];
  var rotasLiberadasUsuariosPerfilControlador = ['/usuarios'];
  var rotasLiberadasUsuariosPerfilControlado = ['/usuarios'];
  
  $rootScope.$on('$locationChangeStart', function () {
	  console.log('$locationChangeStart ' + $location.path());//TODO remover
	  
	  //iremos chamar essa função sempre que o endereço for alterado
 
      /*  podemos inserir a logica que quisermos para dar ou não permissão ao usuário.
          Neste caso, vamos usar uma lógica simples. Iremos analisar se o link que o usuário está tentando acessar (location.path())
          está no Array (rotasBloqueadasUsuariosNaoLogados) caso o usuário não esteja logado. Se o usuário estiver logado, iremos
          validar se ele possui permissão para acessar os links no Array de strings 'rotasBloqueadasUsuariosComuns'
      */
 
	  if($rootScope.userProfile !=null){
		  //TODO verificar permissoes
		  console.log('url liberada.');
	  }else{
		  if(rotasLiberadasUsuariosNaoLogados.indexOf($location.path()) == -1){
			  console.log('url bloqueada.');
			  $location.path('/login');
		  }else{
			  console.log('url test: '+rotasLiberadasUsuariosNaoLogados.indexOf($location.path()) );
		  }
	  }
	  
      /*if(localStorage.getItem("minhamesadaapp.userProfile") == null && rotasBloqueadasUsuariosNaoLogados.indexOf($location.path()) != -1){
          $location.path('/acessoNegado');
          console.log('$locationChangeStart 1');
      }else{
    	  console.log('$locationChangeStart 2');
          if($rootScope.usuarioLogado != null &&
               rotasBloqueadasUsuariosComuns.indexOf($location.path()) != -1 &&
               $rootScope.usuarioLogado.admin == false){
        	  console.log('$locationChangeStart 3');
        	  $location.path('/login');
          }
         // $location.path('/acessoNegado');
      }
      */
    	  
  });
  
  if($rootScope.usuarioLogado == null){
	  console.log('usuário não autenticado!');
	  $location.path('/login');
  }
  
});
