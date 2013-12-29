exports.views = {
    environment_by_service: {
        map: function (doc) {
            if (doc._id.indexOf("asset.service") >= 0) {
                for (var i = 0; i < doc.environments.length; i++) {
                    emit(doc.name, doc.environments[i]);
                }
            }
        }
    },    
    cluster_by_environment: {
        map: function (doc) {
            if (doc._id.indexOf("asset.environment") >= 0) {
                for (var i = 0; i < doc.clusters.length; i++) {
                    emit(doc.name, doc.clusters[i]);
                }
            }
        }
    },
    host_by_cluster: {
        map: function (doc) {
            if (doc._id.indexOf("asset.cluster") >= 0) {
                for(var i = 0; i < doc.hosts.length; i++) {    
                    emit(doc.name, doc.hosts[i]);
                }
            }
        }
    },
    cluster_by_lb: {
        map: function (doc) {
            if (doc._id.indexOf("asset.cluster") >= 0) {
                emit(doc.lb, doc.name);
            }
        }
    },
    cluster_by_vip: {
        map: function (doc) {
            if (doc._id.indexOf("asset.cluster") >= 0) {
                emit(doc.vip, doc.name);
            }
        }
    },
    cluster_by_colo: {
        map: function (doc){
            if (doc._id.indexOf("asset.cluster") >= 0) {
                emit(doc.colo, doc.name);
            }
        }
    },
    cluster_by_host: {
        map: function (doc) {
            if (doc._id.indexOf("asset.cluster") >= 0) {
                for(var i=0; i < doc.hosts.length; i++) {
                    emit(doc.hosts[i], doc.name);
                }
            }
        }
    },
    cluster_by_type: {
        map: function (doc) {
            if (doc._id.indexOf("asset.cluster") >= 0) {
                emit(doc.cluster_type, doc.name);
            }
        }
    },
    service_by_environment: {
        map: function (doc) {
            if (doc._id.indexOf("asset.service") >= 0) {
                for (var i = 0; i < doc.environments.length; i++) {
                    emit(doc.environments[i], doc.name);
                }
            }
        }
    },
    environment_by_cluster: {
        map: function (doc) {
            if (doc._id.indexOf("asset.environment") >= 0) {
                for (var i = 0; i < doc.clusters.length; i++) {
                    emit(doc.clusters[i], doc.name);
                }
            }
        }
    }
}
