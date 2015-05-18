ckan.module('ngsiviewchart',function(jQuery,_){
    return{
        options:{
            i18n:{error:_('An error occurred: %(text)s %(error)s')},
            parameters:{contentType:'application/json',
                            dataType:'json',
                            dataConverter:function(data){return JSON.stringify(data,null,2);},
                            language:'json',type:'GET'}},
        initialize:function(){
            var self=this;
            var p;
            p=this.options.parameters;

            if(typeof(view_enable) == 'undefined'){
                view_enable = [];
                view_enable[0] = true;
                resource_url = preload_resource['url']
            }

	    var DygraphContent = "";
	    function makeGraph(DygraphContent){
     		new Dygraph(
          		document.getElementById("chart"),
          		DygraphContent,
          		{
           		 fillGraph: 'true',
           		 rollPeriod: 14,
           		 legend: 'always',
           		 labelsDivStyles: { 'textAlign': 'right' },
           		 showRangeSelector: true
          		}
      		);
	    }

            if(view_enable[0]){
                jQuery.ajax(resource_url,{
                    type:p.type,
                    contentType:p.contentType,
                    dataType:p.dataType,
                    success:function(data,textStatus,jqXHR){
                        if(preload_resource['format'].toLowerCase() == 'ngsi-h'){
                            document.getElementById('chart').style.height = '400px';
                            document.getElementById('chart').style.border = '1px solid rgba(0, 0, 0, 0.15)';

                            if(typeof(data.contextResponses) != 'undefined'){
                                var entity_id = '';
                                var attribute_name = '';
                                var attributes = [];
				var v_list = [];
				var d_list = [];
                                for(i=0;i<data.contextResponses.length;i++){
                                    attributes = data.contextResponses[i].contextElement.attributes;
                                    for(e=0;e<attributes.length;e++){
					var i_a = data.contextResponses[i].contextElement.id+"_"+attributes[e].name;
					v_list[v_list.length] = ['Date', i_a]; 
					d_list[d_list.length] = ['Date', i_a];
                                        for(z=0;z<attributes[e].values.length;z++){
					    var d = attributes[e].values[z].recvTime.substring(0,10).replace(/-/gi, "/");
					    var h = attributes[e].values[z].recvTime.substring(11,19)
				            var g_date = d+" "+h;
					    var value  = parseFloat(attributes[e].values[z].attrValue);					    
                                            v_list[v_list.length] = [g_date, value];
					    d_list[d_list.length] = [attributes[e].values[z].recvTime, value];
		                        }
        	                            var csvContent = "";
	                                    var DygraphContent = "";

                                            for(var z=0;z<v_list.length;z++){
                                                DygraphContent += v_list[z].join(", ")+"\n";
                                                csvContent += d_list[z].join(", ")+"%0A";
                                            }
				            makeGraph(DygraphContent);
                                     }
				}

			        var dbtn ="<a id='dbtn' class='btn btn-primary'><b>Download</b></a>";
                                $("#chart").before(dbtn);
				document.getElementById('dbtn').addEventListener('click', function () {

					var a         = document.createElement('a');
					a.href        = 'data:attachment/csv,' + csvContent;
					a.target      = '_blank';
					a.download    = i_a+'.csv';

					document.body.appendChild(a);
					a.click();
				}, false);
                            }
                        }
                    },
                    error:function(jqXHR,textStatus,errorThrown){
                        if(textStatus=='error'&&jqXHR.responseText.length){
                            document.getElementById('chart').style.height = '0px';
                            document.getElementById('chart').style.border = '0px';
                        }
                        else{document.getElementById('chart').style.height = '0px';;
                            document.getElementById('chart').style.border = '0px';}}
                });
            }
        }
    }
});

