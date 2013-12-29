exports.views = {
    vm: {
        map: function (doc) {
            if(doc.virtual) {
            	if(doc.virtual.is_virtual=="true")
               emit(doc._id,doc.other.fqdn);
            }
        }
    },
    product: {
    	map: function(doc){
    		if(doc.other){
    			emit([doc.other.manufacturer,doc.other.productname],doc.other.fqdn);
    		}
    	}
    },
    os : {
    	map: function(doc){
    		if(doc.os.operatingsystem)
    			emit(doc.os.operatingsystem,doc.other.fqdn);
    	}
    }
};