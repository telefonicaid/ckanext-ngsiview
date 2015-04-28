ckan.module('ngsiviewchart',function(jQuery,_){
    if(preload_resource['format'] == 'ngsiSTH'){
        document.getElementById('chart').style.height = '400px';
        $('#chart').highcharts({
            chart: {
                type: 'spline'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            plotOptions: {
                series: {
                    allowPointSelect: true
                }
            },
            series: [
            {
                name: 'attribute1',
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            },
            {
                name: 'attribute2',
                data: [71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 20.1]
            }
            ]
        });
    }
});
