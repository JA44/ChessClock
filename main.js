$(function(){
    
   var Player = Backbone.Model.extend({
       defaults: function() {
	    return {
		name		    : "Player 1",
		time		    : 1200,
		isCurrent	    : false,
		currentIntervalId   : null
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.set({time : that.get('time') - 1 })
	},
	isCurrentPlayer: function(is){
	    if(is){
		this.set({isCurrent: true});
		this.set({currentIntervalId: setInterval(this.decrementTime, 1000, this)});
	    }else{
		this.set({isCurrent: false});
		clearInterval( this.get('currentIntervalId') );
	    }
	}
	
   });
   
   
   window.ChessClock = Backbone.Router.extend({

        initialize : function() {
	    alert('here');
            var player1 = new Player({name: 'Player 1', time:1200});
	    var player2 = new Player({name: 'player 2', time:1200});
	    player1.isCurrentPlayer(true);


	    setTimeout(function(){
		player1.isCurrentPlayer(false);
		alert(player1.get('time'));
	    }, 5000);

	    setTimeout(function(){
		alert(player1.get('time'));
	    }, 10000);
        },
	changePlayer: function(){
	    
	}
    });
    
   /* window.MainView = Backbone.View.extend({
        el : $('#doc-container'),
        initialize : function() {
            this.template = _.template($('#doc-template').html());
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        }

    });*/
   
   
   
  
   
   
   
});