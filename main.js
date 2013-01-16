$(function(){
    
   var Player = Backbone.Model.extend({
       defaults: function() {
	    return {
		name		    : "Player 1",
		time_remaining	    : 1200,
		isCurrent	    : false,
		currentIntervalId   : null
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.set({time : that.get('time_remaining') - 1 })
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
   
   window.MainView = Backbone.View.extend({
        el : $('#main'),
	events: {
	  'click' : 'change'
	},
        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        },
	change: function(){
	    alert('change');
	}
    });
   
 
    window.Player1View = Backbone.View.extend({
        el : $('#player1'),
        initialize : function() {
            this.template = _.template($('#player-template').html());
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        }
    });
    
    window.Player2View = Backbone.View.extend({
        el : $('#player2'),
        initialize : function() {
            this.template = _.template($('#player-template').html());
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        }
    });
    

   window.ChessClock = Backbone.Router.extend({

        initialize : function() {
	    var main	= new MainView(); 
            var player1 = new Player({name: 'Player 1', time:1200});
	    var player2 = new Player({name: 'Player 2', time:1200});

	    var player1View = new Player1View({
		model : player1
	    });

	    var player2View = new Player2View({
		model : player2
	    });

	    player1View.render();
	    player2View.render();

        },
	changePlayer: function(){
	    
	}
    });

    var App = new ChessClock();	
   
   
   
  
   
   
   
});