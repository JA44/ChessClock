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
   
   var Params = Backbone.Model.extend({
       defaults: function() {
	    return {
		duration	    : 1199,
		player1		    : 'Player 1',
		player2		    : 'Player 2'
	    };
	}
   });
   /*
    * Model Player
    */ 
   var Player = Backbone.Model.extend({
       defaults: function() {
	    return {
		name		    : "Player 1",
		time_remaining	    : param.get('duration'),
		current		    : false,
		currentIntervalId   : null
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.set({time_remaining : that.get('time_remaining') - 1 });
	},
	play: function(){
	    this.set({currentIntervalId: setInterval(this.decrementTime, 1000, this)});
	},
	stop: function(){
	    clearInterval( this.get('currentIntervalId') );
	    this.set({currentIntervalId: null});
	},
	isPlaying: function(){
	    return this.get('currentIntervalId') !== null;
	},
	setCurrent: function(current){
	    if(current){
		this.set({current: true});
		this.play();
	    }else{
		this.set({current: false});
		this.stop();
	    }
	}	
   });
   
   /*
    * View MainView
    */ 
   MainView = Backbone.View.extend({
        el : $('body'),
	//events: events,
	events: {
	   'click #switch'	:  'switchPlayer',
	   'click #config'	:  'params',
	   'click #play-pause'  :  'playOrPause',
	   'click #stop'	:  'stop'
	},
	init: function(){
		players.at(0).setCurrent(false);
		players.at(1).setCurrent(false);
		players.at(0).set({time_remaining: 1200});
		players.at(1).set({time_remaining: 1200});
	},
	switchPlayer: function(){
	    
	    
	    $(this.el).find('#play-pause i').removeClass('icon-play');
	    $(this.el).find('#play-pause i').addClass('icon-pause');
	    var currentPlayer = players.getCurrent(true);
	    if(currentPlayer.length > 0){
		var notCurrentPlayer = players.getCurrent(false);
		currentPlayer[0].setCurrent(false);
		notCurrentPlayer[0].setCurrent(true);		
	    }else{
		players.at(0).setCurrent(true);
	    }
	},
	playOrPause: function(){
	    if(players.hasPlaying()){
		this.pause();
	    }else{
		this.play();
	    }
	},
	stop: function(){
	    //TODO : create view PlayPause doit gérér l'état'
	    $(this.el).find('#play-pause i').removeClass('icon-pause');
	    $(this.el).find('#play-pause i').addClass('icon-play');
	    this.init();
	},
	pause: function(){
	    $(this.el).find('#play-pause i').removeClass('icon-pause');
	    $(this.el).find('#play-pause i').addClass('icon-play');
	    players.at(0).stop();
	    players.at(1).stop();
	},
	play: function(){
	    $(this.el).find('#play-pause i').removeClass('icon-play');
	    $(this.el).find('#play-pause i').addClass('icon-pause');
	    var currentPlayer = players.getCurrent(true);
	    if(currentPlayer.length === 0){

	    }else{
		currentPlayer[0].play();
	    }
	},
	params: function(){
	    //window.location.href = '#params';
	    App.params();
	},
	//TODO: delete si pas utiliser
	handlerStart: function(){
		time = new Date().getTime();
	},
	handlerEnd: function(){
	    		this.params();
			return;
		var diff= new Date().getTime() - time;
		if(diff >= 8000){	
			//appui très long => paramètre
			this.params();
		}
		if(diff >= 2000 & diff < 8000){	
			//appui long
			this.init();
		}
		if(diff < 2000){
			//appui court
			this.switchPlayer();
		}
	}

    });
   
   /*
     * View ParamView
     */
    ParamView = Backbone.View.extend({
	events: {
		//'change input' : 'changeValue'
		//TODO onclose
	},
        initialize : function() {
            this.template = _.template($('#param-template').html());
	    this.listenTo(this.model, 'change', this.render);
	    this.render();
	    /*$('#myModal').on('hidden', function () {
		this.changeValue();
	      })*/
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
	    this.inputP1 = this.$('#player1');
            return this;
        },
	changeValue: function(){
	    this.model.set({duration: 63});
	    players.at(0).set({name:'dsqdqs'});
	    //alert( this.inputP1.val());
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
	    if( this.model.isPlaying() ){
		$(this.el).addClass('current');
	    }else{
		$(this.el).removeClass('current');
	    }
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
	},
	hasPlaying: function(){
	    var playerPlaying = this.find(function(player){
		return player.isPlaying();	
	    });
	    return playerPlaying;
	}
    });
     
     /*
     * Router PlayerList
     */
   ChessClock = Backbone.Router.extend({
	routes:{
	    "params": "params"
	},
	initialize : function() {
	    var main	= new MainView(); 
            players.add(
		new Player({name: param.get('player1'), time:1200})
	    );
	    players.add(
		new Player({name: param.get('player2'), time:1200})
	    );

	    var player1View = new PlayerView({
		model : players.at(0), el: $('#player1')
	    });

	    var player2View = new PlayerView({
		model : players.at(1), el: $('#player2')
	    });
	    
	    this.paramView = new ParamView({
		model : param, el: $('#param')
	    })
	    
        },
	params: function(){
	    
	    $('#myModal').modal('show');
	}
    });
    //Lancement de l'application
    var time;
    var players = new PlayerList;
    var param = new Params();
    var App = new ChessClock();
    Backbone.history.start();
});