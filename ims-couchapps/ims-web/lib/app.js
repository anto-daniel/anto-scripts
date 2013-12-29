// lib/app.js

exports.views = {
    main: {
        map: function(doc) {
              if(doc.servername){
                  emit(doc.servername, {"servername":doc.servername,
                                        "itag" :doc.itag,
                                        "switch":doc.switchname,
                                        "switchport":doc.switchport,
                                        "rack":doc.rack,
                                        "racku":doc.racku,
                                        "physical":doc.physical,
                                        "macid":doc.macid,
                                        "processorcount":doc.processor.physicalprocessorcount,
                                        "processor":doc.processor.processor0,
                                        "ram":doc.memory.memorytotal,
                                        "ip":doc.ip.ipaddress,
                                        "netmask":doc.netmask,
                                        "ipmidrac":doc.ipmidrac,
                                        "owner":doc.owner,
                                        "project":doc.project,
                                        "uptime":doc.uptime,
                                        "operatingsystem":doc.operatingsystem,
                                        "operatingsystemrelease":doc.operatingsystemrelease,
                                        "kernelrelease":doc.kernelrelease,
                                        "osarchitecture":doc.architecture,
                                        "bios_version":doc.bios_version,
                                        "bios_vendor":doc.bios_vendor,
                                        "fqdn":doc.fqdn,
                                        "hardwaremodel":doc.hardwaremodel,
                                        "manufacturer":doc.manufacturer,
                                        "productname":doc.productname,
                                        "serialnumber":doc.serialnumber

                                      });
              }
            }
    }
};

exports.shows ={
  main: function(doc, req) {
  return {
    body: "Hello World" +req.id
  }
}
}

exports.lists={
  main:function(doc, req) {   

      fields=req.query['filter'].split(",");
      

         json = '{ "aaData":  [\n';
     
       while (row = getRow()) {
     
          
          var value=row.value[eval("fields[0]")];
          json += '\t{ "'+fields[0]+'" :"'+value + '",\n';
          
          for(var i=1;i<fields.length;i++){

            var value=row.value[eval("fields[i]")];
            json += '\t  "'+fields[i]+'" :"'+value + '",\n';
                  
          }
          json=json.substring(0,json.length - 2);
          json +='\n\t},\n' ;


            
        }   
       
        json=json.substring(0,json.length - 2);
        json+='\n\t]\n}\n';
        return json;
}


}

  



