exports.views = {
	"auto_itag" : {
		"map": function(doc){
 		if (doc._id.indexOf("server") >= 0) {
 			var matches = /^(\w+\d+)(?:SR|VM)(\d+)$/.exec(doc.itag);
			emit(matches[1], parseInt(matches[2]));
   				}
			},
		reduce : function(key,values){
			 var max = -Infinity
   			 for(var i = 0; i < values.length; i++)
        			if(typeof values[i] == 'number')
          		 	   max = Math.max(values[i], max)
    				return max
			}
	}	
	
}
