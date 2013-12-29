/****        
pie.js
           
Description: Custom JS plugin for pie chart visulaization of couchDB reduced view
            
Assumption: The couchDB view always return a JSON response array of hash's containing key-value pairs, 
where key can be of any data structure (array, hash,...) and value is always an integer.
           
Functions: 
             
  1. pieChart()
          
       Function Signature: pieChart(title,tname,div,uri,dataCB,selectECB,unselectECB,mhoverECB,moutECB)
       
       Function Description: pieChart() is used to render pie visulaization for a given couchdb view, it takes 4 params of type string & 5 call backs
                  
       Param Description:
                   
         Attribute	        Type		Description
         ___________________________________________
         title    	        string	    title of the pie chart
         tname              string      tooltip name
         div                string      div container id to display the pie chart
         dataCB             function    callback to get formatted input for pie chart       
         selectCB           function    callback for select event, it will be triggered when a pie is selected
         unselectCB         function    callback for unselect event, it will be triggered when a pie is unselected
         mhoverECB          function    callback for mouseOver event, it will be triggered when you mouseOver on a pie  
         moutECB            function    callback for mouseOut event, it will be triggered when you mouseout on a pie 
         
  2. getViewData()
                
       Function Signature: getViewData(uri)
                  
       Function Description: getViewData() is used to execute jQuery ajax GET to the given uri and return the reuired JSON data. 
       It takes the uri as the argument.
                  
***/


//Sub Routine to get JSON response from couchdb view
function getViewData(uri, cb) {
  $.ajax({
    type: 'GET',
    headers: {
      'Content-Type': "application/json"
    },
    url: uri
  })
    .done(function (response) {
      var res = JSON.parse(response);
      var data = res["rows"];
      cb(data);
    });
}


//Sub Routine to convert a couchdb reduced view into pie chart
function pieChart(title, tname, div, uri, dataCB, selectECB, unselectECB, mhoverECB, moutECB) {

  getViewData(uri, function (response) {

    //Data Input for HighCharts  
    var pie_data = [];

    response.forEach(function (res) {
      var unique_rec = dataCB(res["key"], res["value"]);
      pie_data.push(unique_rec);
    });

    //Sorted Data Input
    pie_data.sort(function (a, b) {
      return parseFloat(a.y) - parseFloat(b.y)
    });

    //Invoke HighCharts 
    $(div).highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%<\/b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          point: {
            events: {
              click: function (event) {
                var selected_category = this.name;
                selectECB(selected_category);
              },
              unselect: function () {
                unselectECB();
              },
              mouseOver: function () {
                var selected_category = this.name;
                mhoverECB(selected_category);
              },
              mouseOut: function () {
                moutECB();
              }
            }
          },
        }
      },
      dataLabels: {
        enabled: true,
        color: '#000000',
        connectorColor: '#000000',
        format: '<b>{point.name}<\/b>: {point.percentage:.1f} %'
      },
      series: [{
        type: 'pie',
        name: tname,
        data: pie_data
      }]
    })
  })
}
