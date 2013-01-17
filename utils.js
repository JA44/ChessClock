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
	    return hours + ':' + minuts + ':' + seconds;
	    break
    }
    return buffer;
}


