$(function(){
    if(Modernizr.touch){
	var events = {
		'touchstart' : 'handlerStart',
		'touchend' : 'handlerEnd'
	};
    }else{
	var events = {
		'mouseup' : 'handlerEnd',
		'mousedown' : 'handlerStart'
	};
    }
    
   /*
    * Model Player
    */ 
   var Player = Backbone.Model.extend({
       defaults: function() {
	    return {
		name		    : "Player 1",
		time_remaining	    : 1200,
		current		    : false,
		currentIntervalId   : null
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.set({time_remaining : that.get('time_remaining') - 1 });
	},
	setCurrent: function(current){
	    if(current){
		this.set({current: true});
		this.set({currentIntervalId: setInterval(this.decrementTime, 1000, this)});
	    }else{
		this.set({current: false});
		clearInterval( this.get('currentIntervalId') );
	    }
	}	
   });
   
   /*
    * View MainView
    */ 
   MainView = Backbone.View.extend({
        el : $('body'),
	events: events,
	init: function(){
		players.at(0).setCurrent(false);
		players.at(1).setCurrent(false);
		players.at(0).set({time_remaining: 1200});
		players.at(1).set({time_remaining: 1200});
	},
	switchPlayer: function(){
	    var currentPlayer = players.getCurrent(true);
	    if(currentPlayer.length > 0){
		var notCurrentPlayer = players.getCurrent(false);
		currentPlayer[0].setCurrent(false);
		notCurrentPlayer[0].setCurrent(true);
	    }else{
		players.at(0).setCurrent(true);
	    }
	},
	handlerStart: function(){
		time = new Date().getTime();
	},
	handlerEnd: function(){
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
   
    /*
     * View PlayerView
     */
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
    
    /*
     * Collections PlayerList
     */
    var PlayerList = Backbone.Collection.extend({
	model : Player,
	getCurrent: function(current){
	    return this.filter(function(player){
		if(current){
		    return player.get('current');	
		}else{
		    return !player.get('current');	
		}
	    })
	}
    });
     
     /*
     * Router PlayerList
     */
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
    var time;
    var players = new PlayerList;
    var App = new ChessClock();	
});
