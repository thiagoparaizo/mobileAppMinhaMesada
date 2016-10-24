angular.module('starter.utildb', [])

.service('DatabaseUtil', function () {

	return{
		getConfigApp: function(){
			 
			var retorno = firebase.database().ref('config_app');
	          
	          retorno.on('value', function(snapshot) {
	      		if(snapshot!=null){
	      			console.log('... on ');
	      			return snapshot;
	      		}else{
	      			console.log('... on null');
	      			return null;
	      		}
	      	});
	            
		  }
	} 
	});