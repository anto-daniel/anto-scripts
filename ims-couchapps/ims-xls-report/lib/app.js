exports.views = {
 ims_infra_stats: {
    map: function (doc) {
      if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.network") >= 0 || doc._id.indexOf("asset.storage") >= 0 || doc._id.indexOf("asset.invalid") >= 0) {
        if (doc.itag.match(/[A-Z]{2,3}[0-9](SR|NW|ST)/)) {
          if (doc.physical) {
            if (doc.physical == true) {
              if (doc.macid != null) {
                emit("valid", doc._id);
              }
              if (doc.macid == null && doc.servername != null) {
                emit("no_macid_with_servername", doc._id);
              }
              if (doc.macid == null && doc.servername == null) {
                emit("orphan", doc._id);
              }
            }
          }
        }
        else {
          emit("invalid_itag", doc._id);
        }
      }
    },
    reduce: '_count'
  },
};
