$(function(){
    
   var Player = Backbone.Model.extend({
       defaults: function() {
	    return {
		name		    : "Player 1",
		time_remaining	    : 1200,
		currentPlayer	    : false,
		currentIntervalId   : null
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.set({time : that.get('time_remaining') - 1 })
	},
	isCurrentPlayer: function(is){
	    if(is){
		this.set({currentPlayer: true});
		this.set({currentIntervalId: setInterval(this.decrementTime, 1000, this)});
	    }else{
		this.set({currentPlayer: false});
		clearInterval( this.get('currentIntervalId') );
	    }
	}
	
   });
   
   window.MainView = Backbone.View.extend({
        el : $('#main'),
	events: {
	  'click' : 'change'
	},
	change: function(){
	    alert('change');
	}
    });
   
 
    window.PlayerView = Backbone.View.extend({
        initialize : function() {
            this.template = _.template($('#player-template').html());
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        }
    });
    
    var PlayerList = Backbone.Collection.extend({
	model : Player,
	currentPlayer: function(){
	    return this.filter(function(player){
		return player.get('currentPlayer');
	    })
	}
    });
    
    var players = new PlayerList;

   window.ChessClock = Backbone.Router.extend({

        initialize : function() {
	    var main	= new MainView(); 
            var player1 = new Player({name: 'Player 1', time:1200});
	    var player2 = new Player({name: 'Player 2', time:1200});

	    players.add([player1, player2]);
	    player1.isCurrentPlayer(true);
	    console.dir( players.currentPlayer());

	    var player1View = new PlayerView({
		model : player1, el: $('#player1')
	    });

	    var player2View = new PlayerView({
		model : player2, el: $('#player2')
	    });

	    player1View.render();
	    player2View.render();

        },
	changePlayer: function(){
	    
	}
    });
    //Lancement de l'application
    var App = new ChessClock();	
});