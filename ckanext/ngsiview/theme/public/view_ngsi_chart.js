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
                if(view_enable[0]){
                    jQuery.ajax(resource_url,{
                        type:p.type,
                        contentType:p.contentType,
                        dataType:p.dataType,
                        success:function(data,textStatus,jqXHR){
                            if(preload_resource['format'].toLowerCase() == 'ngsi-sth'){
                                document.getElementById('chart').style.height = '400px';
                                document.getElementById('chart').style.border = '1px solid rgba(0, 0, 0, 0.15)';

                                var series = [];
                                createChart = function (series) {
                                    $('#chart').highcharts('StockChart', {
                                            title: {text: ''},
                                            series: series
                                        });
                                }

                                if(typeof(data.contextResponses) != 'undefined'){
                                    var entity_id = '';
                                    var attribute_name = '';
                                    var attributes = [];

                                    for(i=0;i<data.contextResponses.length;i++){
                                        entity_id = data.contextResponses[i].contextElement.id;
                                        attributes = data.contextResponses[i].contextElement.attributes;
                                        for(e=0;e<attributes.length;e++){
                                            var v_list = [];
                                            attribute_name = attributes[e].name;
                                            for(z=0;z<attributes[e].values.length;z++){
                                                date = Date.parse(attributes[e].values[z].recvTime);
                                                value = parseFloat(attributes[e].values[z].attrValue);
                                                v_list[v_list.length]=[date, value];
                                            }
                                            series[series.length]={
                                                name: entity_id+"-"+attribute_name,
                                                type: 'area',
                                                gapSize: 5,
                                                tooltip: {
                                                    valueDecimals: 2
                                                },
                                                fillColor : {
                                                    linearGradient : { x1: 0, y1: 0, x2: 0, y2: 1},
                                                    stops : [
                                                        [0, Highcharts.getOptions().colors[e]],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[e]).setOpacity(0).get('rgba')]
                                                    ]
                                                },
                                                threshold: null,
                                                data: v_list,
                                            }
                                        }
                                    }
                                    createChart(series);
                                }
                            }
                        }
                    });
                }
            }
    }});
