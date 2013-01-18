$(function(){
   var Player = Backbone.Model.extend({
       defaults: function() {
	    return {
		name		    : "Player 1",
		time_remaining	    : 1200,
		currentPlayer	    : false,
		currentIntervalId   : null,
		time_remaining_format: '00:20:00'
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.set({time_remaining : that.get('time_remaining') - 1 });
	    that.set({
		time_remaining_format: utils.date.getFormat(
		    that.get('time_remaining'), 'HH:MM:SS'
		)
	    });
	    
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
   
   MainView = Backbone.View.extend({
        el : $('#main'),
	events: {
		'mouseup' : 'handlerMouseUp',
		'mousedown' : 'handlerMouseDown'
	},
	init: function(){
		players.at(0).isCurrentPlayer(false);
		players.at(1).isCurrentPlayer(false);
		players.at(0).set({time_remaining: 1200});
		players.at(1).set({time_remaining: 1200});
	},
	switchPlayer: function(){
	    var currentPlayer = players.getPlayerCurrent(true);
	    if(currentPlayer.length > 0){
		var notCurrentPlayer = players.getPlayerCurrent(false);
		currentPlayer[0].isCurrentPlayer(false);
		notCurrentPlayer[0].isCurrentPlayer(true);
	    }else{
		players.at(0).isCurrentPlayer(true);
	    }
	},
	handlerMouseDown: function(){
		time = new Date().getTime();
	},
	handlerMouseUp: function(){
		var diff= new Date().getTime() - time;
		if(diff > 2000){
			//appui long
			this.init();
		}else{
			//appui court
			this.switchPlayer();
		}
	}

    });
   
 
    PlayerView = Backbone.View.extend({
        initialize : function() {
            this.template = _.template($('#player-template').html());
	    this.listenTo(this.model, 'change', this.render);
	    this.render();
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        }
    });
    
    var PlayerList = Backbone.Collection.extend({
	model : Player,
	getPlayerCurrent: function(current){
	    return this.filter(function(player){
		if(current){
		    return player.get('currentPlayer');	
		}else{
		    return !player.get('currentPlayer');	
		}
	    })
	}
    });
    
	var time;
    var players = new PlayerList;

   ChessClock = Backbone.Router.extend({
        initialize : function() {
	    var main	= new MainView(); 
            players.add(
		new Player({name: 'Player ' + (players.size() + 1), time:1200})
	    );
	    players.add(
		new Player({name: 'Player ' + (players.size() + 1), time:1200})
	    );

	    var player1View = new PlayerView({
		model : players.at(0), el: $('#player1')
	    });

	    var player2View = new PlayerView({
		model : players.at(1), el: $('#player2')
	    });
        }
    });
    //Lancement de l'application
    var App = new ChessClock();	
});
