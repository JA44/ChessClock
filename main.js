$(function(){
    
   var Player = Backbone.Model.extend({
       defaults: function() {
	    return {
		name	: "Player 1",
		time    : 1200
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.set({time : that.get('time') - 1 })
	},
	isCurrentPlayer: function(is){
	    if(is){
		this.set({currentInterval: setInterval(this.decrementTime, 1000, this)});
	    }else{
		clearInterval( this.get('currentInterval') );
	    }
	}
	
   });
   
   var player1 = new Player({name: 'JA1', time:1200});
   var player1 = new Player({name: 'JA2', time:1200});
   player1.isCurrentPlayer(true);
   
   
   setTimeout(function(){
       player1.isCurrentPlayer(false);
       alert(player1.get('time'));
   }, 5000);
   
   setTimeout(function(){
       alert(player1.get('time'));
   }, 10000);
   
   
   
   
});