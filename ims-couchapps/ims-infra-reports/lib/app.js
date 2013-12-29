exports.views = {
    by_itag: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.itag) {
                    emit(doc.itag, null);
                }
            }
        }
    },
    by_racklocation: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.racklocation) {
                    emit(doc.racklocation, null);
                }
            }
        }
    },
    by_switch: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.switch) {
                    emit(doc.switch, null);
                }
            }
        }
    },
    by_class: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.class) {
                    emit(doc.class, doc._id);
                }
            }
        }
    },
    by_colo: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.colo) {
                    emit(doc.colo, doc._id);
                }
            }
        }
    },
    by_macid: {
        map: function (doc) {
      if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
        if (doc.macid) {
          emit(doc.macid.toLowerCase(), doc._id);
        }
      }
    }
    },
    by_vendor: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.vendor) {
                    emit(doc.vendor, doc._id);
                }
            }
        }
    },
    by_team: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.project) {
                    emit(doc.project, doc._id);
                }
            }
        }
    },
    by_serial: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.serial) {
                    emit(doc.serial, doc._id);
                }
            }
        }
    },
    by_expirydate: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.expirydate) {
                    emit(doc.expirydate, doc._id);
                }
            }
        }
    },
    by_servername: {
        map: function (doc) {
            if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.ec2") >= 0) {
                if (doc.servername) {
                    emit(doc.servername, doc._id);
                }
            }
        }
    },
};
