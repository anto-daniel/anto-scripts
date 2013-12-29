
/* Retrieve all hosts on page load */


    (function(){
        
        property_url='http://ims.corp.inmobi.com:5984/ims/_design/hackcasino/_list/property/property_view';
         
        property=$.ajax({
               type: 'GET',
                headers: {
                    'Content-Type': "application/json"
                },
                    url: property_url,
                    async:false
            }).responseText;
        x=JSON.parse(property);
        load_Data(0,100);
        
    })();

    function load_Data(min,max){
        capasity_url='http://ims.corp.inmobi.com:5984/heartbeat/_design/hackcasino/_list/c_util/capacity_view?min='+min+'&max='+max;
         $.ajax({
        type: 'GET',
        headers: {
            'Content-Type': "application/json"
        },
        url: capasity_url,
        success: function (data) {
            gData=data;
            for (var key in data) {
               //alert(data[key].macid);
               //alert(x);
                //data[key].property=x[data[key].macid];
                for(var i in x){
                    if(data[key].macid==x[i].macid){
                        data[key].property=x[i].property;
			if (typeof(x[i]['hwprofile']) !== 'undefined') {
			    data[key].hwprofile = x[i].hwprofile;
			}
                    }
                }
            }
           table_init(data,0,100);

            }
        });

    }
    
/* Populates underutilised server table - Invoked on page load*/    
function table_init(fdata){    
    var i=0;
    $("#unused-asset-table-c").html("<table cellpadding='0' cellspacing='0' border='0' class='table table-bordered table-hover' id='unused-asset-table'>\
                    <thead><th id=\"selfld\"></th> <th>Hostname</th> <th>Property</th> <th>Type</th> <th>Manufacturer</th> <th>RAM</th>\
                    <th>Physical Processor Count</th> <th>Number of Cores</th> <th>Avg. Memory Utilisation(%)</th>\
                    <th>Avg. Cpu Utilisation(%)</th>\
                    <th id=\"netavgtitle\">Net Avg. Utilisation</th>\
                  </thead>\
                  <tbody></tbody>\
                </table>");
  dTable=  $('#unused-asset-table').dataTable( {
        "bProcessing": true,
        "bDestroy":true,
     //   "sAjaxSource": 'arrays1.txt',

        "aaData":fdata,
        "aaSorting": [[ 10, "asc" ]],
        "aoColumns": [
                        { "mData": "macid" },
                        { "mData": "hostname" },
                        { "mData": "property" },
                        { "mData": "type" },
                        { "mData": "manufacturer" },
                        { "mData": "ram","sWidth": "10%" },
                        { "mData": "physicalProcessorCount" },
                        { "mData": "processorCount" },
                        { "mData": "memory"},
                        { "mData" : "cpu"},
                        { "mData" : "netavg"}
                    ],
                    aoColumnDefs  : [
{
    aTargets: [0],    // Column number which needs to be modified
    fnRender: function (o, v) {   // o, v contains the object and value for the column
        return '<input type="checkbox" class="macids" name="someCheckbox" value='+v+' />';
    },
    sClass: 'tableCell'    // Optional - class to be applied to this table cell
}],
 

        "sPaginationType": "bootstrap",
        "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page"
                    },
        "sDom": '<"left"f><"top"T>tlrip',
        "oTableTools": {
            "sSwfPath": "media/swf/copy_csv_xls_pdf.swf",
            "aButtons": [ "print","xls" ]
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
     
        if(aData['netavg']<=20){
             $(nRow).addClass("warning");
        }else if(aData['netavg']>20 && aData['netavg']<=80){
            $(nRow).addClass("info");
        }else{
                $(nRow).addClass("error");
        }

     /*   var i=aData['netavg'];
        var r=(i*2.5);
        var g=255;*/
           
         

        }

      } );   
}


        //******************************************************************Released assets Table **************************************************************************
 /*      
        $('#released-asset-table-c').html( '<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered table-hover table-striped" id="released-asset-table"></table>' );
        
        $('#released-asset-table').dataTable( {
        "bProcessing": true,
        "sAjaxSource": 'sources/main2.txt',
        "aoColumns": [
            { "mData": "itag" },
            { "mData": "servername" },
            { "mData": "switch" },
            { "mData": "owner" },
            { "mData": "physical" }
        ],
        
                    "sPaginationType": "bootstrap",
                    "oLanguage": {
                        "sLengthMenu": "_MENU_ records per page"
                    },
        "sDom": 'T<"clear">lfrtip',
        "oTableTools": {
            "sSwfPath": "media/swf/copy_csv_xls_pdf.swf",
            "aButtons": [ "print","xls" ]
        }


      } );   */

/* function to get all selected macids */
 function get_selected_macids(){
        var values = $('input:checkbox:checked.macids').map(function () {
        return this.value;
        }).get();
        return values;
        
  }
//*************************** Melvil ******************************************//

/*
  function get_teams()
{
url="http://ims.corp.inmobi.com:5984/ims/_design/hackasino/_view/by_team";
teams=[];
 $.ajax({
        type: 'GET',
        headers: {
            'Content-Type': "application/json"
        },
        url: url,
        success: function (data) { data=JSON.parse(data);
j=0;
for(i=0;i<data.rows.length;i++){

if(data.rows[i].value!=null)
{

teams[j]=data.rows[i].value; 
j++;
}
}

 $('#search').typeahead({source: teams});
}});
}
function passtodb()
{
var val=$("#search").val();
$.ajax({
        type: 'GET',
        headers: {
            'Content-Type': "application/json"
        },
        url: url,
        success: function (data) { data=JSON.parse(data);
j=0;
for(i=0;i<data.rows.length;i++){

if(data.rows[i].value!=null)
{

teams[j]=data.rows[i].value; 
j++;
}
}
if(teams.indexOf(val)==-1)
{alert("Enter correct owner");}
else{ 
status=$('input:radio[name=optionsRadios]:checked').val();
if(status=="Reserved")
{
var reason=$("#reason").val();
}
else
{
var reason="";
}
property=$("#search").val();
var today = new Date();
var select=$("#sl").val();
var hash={}

hash["reason"]=reason;
hash["owner"]=property;
hash["date"]=today;
hash["status"]=status;
hash["review_time"]=select;
var macid=get_selected_macids();


setProperty(macid,hash,function(data){

      if(data == "success"){
       $('#myModal').modal('toggle');
$("#s").html('</br><div class="alert alert-success"> <a href="#" class="alert-link">Succesfully inserted  data</a></div>');

      } else{$('#myModal').modal('toggle');$("#s").html('</br><div class="alert alert-danger"> <a href="#" class="alert-link">Error  data</a></div>');}
});   


}
 
}});

}

$(document).ready(function () {
   $("input[name=optionsRadios]:radio").change(function () {
$("#reason_text").empty();
status=$('input:radio[name=optionsRadios]:checked').val();

if(status=="Reserved")
{
$("#reason_text").html('&nbsp; &nbsp;  &nbsp;<textarea id="reason" data-required="true" placeholder="Reason?" rows="2"></textarea>');}});
});

*/
