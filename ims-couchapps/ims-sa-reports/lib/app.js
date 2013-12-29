exports.views = {
    by_ipaddress: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.ip) {
                    emit(doc.ip.ipaddress, doc.other.fqdn);
                }
            }
        }
    },
    by_processor_speed: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.processor) {
                    emit(doc.processor.sp_current_processor_speed, doc.other.fqdn);
                }
            }
        }
    },
    by_processor_model: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                for(k in doc.processor) {
                    if(k.match(".*[0-9]$")) {
                        emit(doc.processor[k], doc.other.fqdn);
                    }
                }
            }
        }
    },
    by_processor_count: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.processor) {
                    emit(doc.processor.processorcount, doc.other.fqdn);
                }
            }
        }
    },
    by_memory: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if(doc.memory) {
                    emit(doc.memory.memorytotal, doc.other.fqdn);
                }
            }
        }
    },
    by_os: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if(doc.os.operatingsystem) {
                    emit(doc.os.operatingsystem, doc.other.fqdn);
                }
            }
        }
    },
    by_kernel: {
        map: function(doc) {
            if(doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                for (attr in doc.kernel) {
                    emit(doc.kernel[attr], doc.other.fqdn);
                }
            }
        }
    },
    all_attributes: {
        map: function (doc) {
            function recur(subdoc,prefix) {
                for (var p in subdoc) {
                    if(!p.match(/^_/)) {
                        p = p.replace(/ +/g, "");
                        var obj_type = Object.prototype.toString.call(subdoc[p]);
                        if ( obj_type === "[object Object]") {
                            if(prefix == undefined) {
                                recur(subdoc[p],p);
                            }
                            else {
                                recur(subdoc[p],prefix+'.'+p);
                            }
                        }
                        else {
                            if (isNaN(subdoc[p])) { 
                                if (typeof subdoc[p] === 'object') {
                                    var attr_data_type = "List"
                                }
                                else if (typeof subdoc[p] === 'string') {
                                    var attr_data_type = "String"
                                }
                                else if (typeof subdoc[p] === 'boolean') {
                                    var attr_data_type = "Boolean"
                                }
                                else {
                                    var attr_data_type = "New Type"
                                }
                            }
                            else { 
                                var attr_data_type = "Number"
                            }

                            /*    var attr_data_type = typeof subdoc[p]; */
                            if (prefix == undefined) {
                                emit([asset_type, p], attr_data_type);
                            }
                            else {
                                emit([asset_type, prefix+'.'+p], attr_data_type);
                            }
                        }
                    }
                }
            }
            if(doc._id.match("^asset.*")) {
                pos1 = doc._id.indexOf('.'); pos2 = doc._id.indexOf(':');
                var asset_type = doc._id.slice(pos1+1,pos2);
                if ( asset_type != "attr_doc" && asset_type != "type_doc" ) {
                    if (asset_type === 'server') {
                        if (Object.prototype.toString.call(doc['version']) === '[object Object]') {
                            if (doc.version['ims-facter'] > "2.3") {
                                recur(doc);
                            }
                        }
                    } else {
                        recur(doc);
                    }
                }
            }
        },
        reduce: function (keys,values){

            var len = keys.length;
            var rhash = {};

            for (i=0;i<len;i++){
                rhash[keys[i]]=values[i];
            }

            for (var key in rhash){
                return (key,rhash[key]);
            }
        }
    },
}
