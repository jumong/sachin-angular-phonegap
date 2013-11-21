'use strict';

function get_pie_chart_data(data, PieChartOptions){
	var chart_data = $.extend(true, {}, PieChartOptions.pos);
	chart_data.series[0].data = [];
	var flightType = {name: '', y: '', color: ''}
	flightType.name = "Point-to-Point";
	flightType.y = data["point-to-point"].percent;
	flightType.color = "#662d91";
	chart_data.series[0].data.push(flightType);
	var flightType2 = {name: '', y: '', color: ''}
	flightType2.name = "Connecting";
	flightType2.y = data['connecting'].percent;
	flightType2.color = "#82ca9c";
	chart_data.series[0].data.push(flightType2);
	return chart_data;
}

angular.module('app.controllers')
    .controller('SachinStatsCtrl', ['$scope', 'Data', 'PieChartOptions',
    	function($scope, Data, PieChartOptions){
    		
    		$scope.page = "Sachin Stats";

			$(".sachinStat").animate({
		    	height: "550px"
		  	}, 1500 );
    		
    		Data.get_local('scripts/lib/trafficComp.json').success(function(api_data){
    			$scope.matches = get_pie_chart_data(api_data.res['2013'], PieChartOptions);
    			$scope.runs = get_pie_chart_data(api_data.res['2012'], PieChartOptions);
    			$scope.centuries = get_pie_chart_data(api_data.res['2013'], PieChartOptions);

    		});
    }])