var utils = {};

utils.date = {};
//@time int second
//@format string 'HH:MM:SS'
utils.date.getFormat = function(time, format){
    var buffer = time;
    switch(format){
	case 'HH:MM:SS': 
	    var hours = Math.round( time / 3600 );
	    var minuts = Math.floor(  ( time % 3600 ) / 60 );
	    var seconds = ( time % 3600 ) % 60 ;
	    
	    hours = utils.date.addZero(hours);
	    minuts = utils.date.addZero(minuts);
	    seconds = utils.date.addZero(seconds);

	    return hours + ':' + minuts + ':' + seconds;
	    break
    }
    return buffer;
}
//Format 1 en 01
utils.date.addZero = function(val){
    var buffer = val;
    if(val < 10){
	buffer = '0' + val;
    }
    return buffer;
}


