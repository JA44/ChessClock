$(function(){ 
    var events = {
	'click #switch'	:  'switchPlayer',
	'click #config'	:  'params',
	'click #play-pause'  :  'playOrPause',
	'click #stop'	:  'stop',
    };
    if(Modernizr.touch){
	$.extend(events, {
		'touchstart #control' : 'handlerStart',
		'touchend #control' : 'handlerEnd'
	});
    }else{
	$.extend(events, {
		'mouseup #control' : 'handlerEnd',
		'mousedown #control' : 'handlerStart'
	});
    }
   
   var Params = Backbone.Model.extend({
       localStorage: new Backbone.LocalStorage("params"),
       defaults: function() {
	    return {
		id		    : 1,
		duration	    : 1000,
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
		name		    : "",
		time_remaining	    : param.get('duration'),
		current		    : false,
		currentIntervalId   : null
	    };
	},
	decrementTime: function() {
	    var that = arguments.length != 0 ? arguments[0] : this;
	    that.save({time_remaining : that.get('time_remaining') - 1 });
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
   
   StatePlayView = Backbone.View.extend({
       el : $('body'),
       setStatePlay : function(state){
	   if(state){ //lecture
		$(this.el).find('#play-pause i').removeClass('icon-play');
		$(this.el).find('#play-pause i').addClass('icon-pause');
	   }else{
		$(this.el).find('#play-pause i').removeClass('icon-pause');
		$(this.el).find('#play-pause i').addClass('icon-play');
	   }
       }
   });
   
   /*
    * View MainView
    */ 
   MainView = Backbone.View.extend({
        el : $('body'),
	events: events,
	initialize: function(){
	    //positionne l
	    $('#control').css({
		'top':$('#header').height() + 'px',
		'height':($('#footer').offset().top - $('#header').height()) + 'px'
	    });
	},
	init: function(){
		players.at(0).setCurrent(false);
		players.at(1).setCurrent(false);
		players.at(0).set({time_remaining: param.get('duration')});
		players.at(1).set({time_remaining: param.get('duration')});	
	},
	switchPlayer: function(){
	    statePlay.setStatePlay(true);
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
	    statePlay.setStatePlay(false);
	    this.init();
	},
	pause: function(){
	    statePlay.setStatePlay(false);
	    players.at(0).stop();
	    players.at(1).stop();
	},
	play: function(){
	    statePlay.setStatePlay(true);
	    var currentPlayer = players.getCurrent(true);
	    if(currentPlayer.length === 0){
		this.switchPlayer();
	    }else{
		currentPlayer[0].play();
	    }
	},
	params: function(){
	    App.params();
	},
	handlerStart: function(){
		time = new Date().getTime();
	},
	handlerEnd: function(){
		var diff= new Date().getTime() - time;
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
		'hidden' : 'changeValue'
	},
        initialize : function() {
            this.template = _.template($('#param-template').html());
	    this.render();
        },

        render : function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).append(renderedContent);
	    this.fieldPlayer1 = this.$('#fieldPlayer1');
	    this.fieldPlayer2 = this.$('#fieldPlayer2');
	    this.fieldDuration = this.$('#fieldDuration');
            return this;
        },
	changeValue: function(){
	    this.model.save({player1: this.fieldPlayer1.val()});
	    this.model.save({player2: this.fieldPlayer2.val()});
	    players.at(0).save({name:this.fieldPlayer1.val()});
	    players.at(1).save({name:this.fieldPlayer2.val()});
	    this.model.save({duration: this.fieldDuration.val()});
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
	localStorage: new Backbone.LocalStorage("players"),
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
	    players.fetch();
	    
	    if(players.length !== 2){
		players.create({name: param.get('player1'), time:param.get('duration')});
		players.create({name: param.get('player2'), time:param.get('duration')});
	    }else{
		players.at(0).set({current: false});
		players.at(1).set({current: false});
	    }
	    
	    var player1View = new PlayerView({
		model : players.at(0), el: $('#player1')
	    });

	    var player2View = new PlayerView({
		model : players.at(1), el: $('#player2')
	    });
	    
	    this.paramView = new ParamView({
		model : param, el: $('body')
	    })
	    
	    statePlay = new StatePlayView();
        },
	params: function(){
	    $('#myModal').modal('show');
	}
    });
    //Lancement de l'application
    var time;
    var statePlay;
    var players = new PlayerList;

    var param = new Params({id:1});
    //need error callback else error javascript
    param.fetch({
	error: function(){}
    });
    var App = new ChessClock();
    Backbone.history.start();
});