'use strict';

var colors;
var colorsArray = ['#25ADA7','#A1D87F','#FF453C','#EFC94C','#AF709A','#FFD530', '#0E229B', '#A4A1CC',
'#7C76B9','#03C7A1','#AEC9EC','#EEB674','#B99076','#348EBA', '#4FCE87', '#EA8B64'
];

function get_pie_chart_data(data, PieChartOptions){
	var chart_data = $.extend(true, {}, PieChartOptions.simplePie);
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

function getScoreBuckets(matches, PieChartOptions) {

	var wonLostScoreBuckets = getWonLostScoreBuckets(matches),
		colors = Highcharts.getOptions().colors,
    categories = ['Won', 'Lost'],
    name = '',
    data = [{
		      y: wonLostScoreBuckets.won,
		      color: colors[0],
		      drilldown: {
		          name: 'Score Buckets',
		          categories: wonLostScoreBuckets.scoreBuckets,
		          data: wonLostScoreBuckets.wonScoreBuckets,
		          color: colors[0]
		      }
		  }, {
		      y: wonLostScoreBuckets.lost,
		      color: colors[1],
		      drilldown: {
		          name: 'Score Buckets',
		          categories: [].concat(wonLostScoreBuckets.scoreBuckets).reverse(),
		          //categories: ['100+', '90-99', '70-89', '50-70', '20-49', '0-20'],
		          data: wonLostScoreBuckets.lostScoreBuckets.reverse(),
		          color: colors[1]
		      }
		  }];

    var wonLostData = [];
    var scoreData = [];
    for (var i = 0; i < data.length; i++) {
        wonLostData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        for (var j = 0; j < data[i].drilldown.data.length; j++) {
            var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
            scoreData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    var chart_data = $.extend(true, {}, PieChartOptions.simplePie);
    chart_data.series = [{
		      data: wonLostData,
		      size: '60%',
		      dataLabels: {
		          formatter: function() {
		              return this.y > 5 ? this.point.name : null;
		          },
		          color: 'white',
		          distance: -30
		      }
		  }, {
		      data: scoreData,
		      size: '80%',
		      innerSize: '60%',
		      dataLabels: {
		          formatter: function() {
		              // display only if larger than 1
		              return this.y > 1 ? '<b>'+ this.point.name +' runs:</b> '+ this.y +''  : null;
		          }
		      }
		  }];

		chart_data.title.text = 'Sachin Score Buckets vs India Won/Lost Match Counts';
		chart_data.plotOptions = {
	      pie: {
	          shadow: false,
	          center: ['50%', '50%']
	      }
	  };
		chart_data.chart.type = 'pie';

		return chart_data;
}

function getWonLostScoreBuckets(matches){
	
	var scoreBuckets = ['0-20', '21-49', '50-70', '71-90', '91-99', '100+'],
		wonScoreBuckets = [0,0,0,0,0,0],
		lostScoreBuckets = [0,0,0,0,0,0],
		wonLostScoreBuckets = {
			won: 0, lost: 0, 
			wonScoreBuckets: wonScoreBuckets, lostScoreBuckets: lostScoreBuckets,
			scoreBuckets: scoreBuckets
		};

	for (var i = 0; i < matches.length; i++){
		matches[i].match_result == 'won' ? wonLostScoreBuckets.won++ : wonLostScoreBuckets.lost++;
		var score = parseInt(matches[i].sachin_score);

		switch(true){
			case (score <= scoreBuckets[0].split('-')[1]):
				matches[i].match_result == 'won'? wonScoreBuckets[0]++ : lostScoreBuckets[0]++;
				break;
			case (score <= scoreBuckets[1].split('-')[1]):
				matches[i].match_result == 'won'? wonScoreBuckets[1]++ : lostScoreBuckets[1]++;
				break;
			case (score <= scoreBuckets[2].split('-')[1]):
				matches[i].match_result == 'won'? wonScoreBuckets[2]++ : lostScoreBuckets[2]++;
				break;
			case (score <= scoreBuckets[3].split('-')[1]):
				matches[i].match_result == 'won'? wonScoreBuckets[3]++ : lostScoreBuckets[3]++;
				break;
			case (score <= scoreBuckets[4].split('-')[1]):
				matches[i].match_result == 'won'? wonScoreBuckets[4]++ : lostScoreBuckets[4]++;
				break;
			case (score > scoreBuckets[4].split('-')[1]):
				matches[i].match_result == 'won'? wonScoreBuckets[5]++ : lostScoreBuckets[5]++;
				break;
		}
	}
	console.log(wonLostScoreBuckets)
	return wonLostScoreBuckets;
}

function getWonLost(matches, PieChartOptions){

	var wonLostScoreBuckets = getWonLostScoreBuckets(matches);
	
	var chart_data = $.extend(true, {}, PieChartOptions.simplePie);
	chart_data.series[0].data = [];
	var wonData = {name: '', y: '', color: ''}
	wonData.name = "Won";
	wonData.y = wonLostScoreBuckets.won;
	wonData.color = "#ff0dff";
	chart_data.series[0].data.push(wonData);
	var lostData = {name: '', y: '', color: ''}
	lostData.name = "Lost";
	lostData.y = wonLostScoreBuckets.lost;
	lostData.color = "#f00";
	chart_data.series[0].data.push(lostData);
	chart_data.title.text = "Matches Won Lost"
	return chart_data;
}

function getCenturyVsBattingOrder(matches, PieChartOptions){
	var battingOrder = {};
	for(var i = 0; i < matches.length; i++){
		if(matches[i].sachin_score >= 100){
			var batting_order = matches[i].batting_order;
			if(battingOrder[batting_order]){
				battingOrder[batting_order]++;
			} else {
				battingOrder[batting_order] = 1;
			}
		}
	}

	var chart_data = $.extend(true, {}, PieChartOptions.simplePie),
		color = ['','blue', 'orange', 'green', 'purple'];
	chart_data.series[0].data = [];
	for(var order in battingOrder){
		var data = {};
		data.name = order;
		data.y = battingOrder[order];
		data.color = color[parseInt(order)];
		chart_data.series[0].data.push(data);
	}
	chart_data.title.text = "Centuries vs Batting Order"
	chart_data.tooltip.formatter = function(){
        return '<b>Batted '+ this.key + ': </b>' + this.y + ' Centuries';
    }

	return chart_data;
}

function custom_chart_settings_by_avg_fare(chart_data){
    chart_data.xAxis = {
                        startOnTick: true,
                        endOnTick: true,
                        showLastLabel: true,
                        lineColor: '#aaa',
                        tickLength: 0,
                        min: 10,
                        max: 60,
                        title: { 
                        	text: "Average",
                        	align: 'middle',
                        	style:{
                        		color: "#666",
                        		fontFamily: "Arial",
                        		fontSize: "12px"
                        	}
                        },
                        "labels": {
                             y: 20,
                            "style": {
                                "color": "#666",
                                "fontFamily": "TitilliumWeb",
                                "fontSize": "12px"
                            },
                            "verticalAlign": "middle"
                       }
                   }

    chart_data.yAxis.tickInterval = 50;
    chart_data.yAxis.title ={
    							text: "Number of Matches",
                        		align: 'middle',
                        		style:{
	                        		color: "#666",
	                        		fontFamily: "Arial",
	                        		fontSize: "12px"
                        		}
    						};
    chart_data.legend = {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 0,
                itemMarginTop: 5,
                itemMarginBottom: 5
            };

    chart_data.tooltip = {
            enabled: true,
            formatter: function() {
            	console.log(this);
                return '<b>'+this.point.name+'</b><br>'+
                	   '<b>Matches: '+this.y+'</b><br>'+
                	   '<b>Average: '+this.x+'</b><br>'+
                	   '<b>Runs: '+this.point.runs+'</b>';
            }
        };

    chart_data.plotOptions.scatter = {
				    					states: {
				                            hover: {
				                                enabled: false,
				                                lineColor: 'rgb(100,100,100)'
				                            }
                        			 	}
    };    
    chart_data.plotOptions.series = {
								    	marker:{
								    		symbol: 'circle'
								    	}
    };
    chart_data.yAxis.max = 500;
    chart_data.yAxis.min = 250;
    chart_data.chart.type = 'scatter';
    chart_data.series = [];
    return chart_data;
}

function get_bubble_chart_data (api_data, colors, ChartOptions) {
    var chart_data = $.extend(true, {}, ChartOptions.pos);
    chart_data = custom_chart_settings_by_avg_fare(chart_data);
    for(var i = 0; i < api_data.length; i++){
        var seriesObj = {name: '', color: '', data: []};
        var dataObj =   {x: '', y: '', runs: '', name: '',
        					marker: {
	        					radius: '',
	        					symbol: 'circle'
    				    	}
    				    }
    	dataObj.x = parseInt(api_data[i].average);
    	dataObj.y = parseInt(api_data[i].matches);
    	dataObj.marker.radius = parseFloat((api_data[i].runs)/500);
		dataObj.runs = parseInt(api_data[i].runs);
		dataObj.name = api_data[i].name;
        seriesObj.name = api_data[i].name;
        seriesObj.color = colorsArray[i];
        seriesObj.data.push(dataObj);
        chart_data.series.push(seriesObj);
    }
    console.log(colorsArray)
    console.log(chart_data)
    return chart_data;
}


angular.module('app.controllers')
    .controller('SachinStatsCtrl',
    	function($scope, Data, PieChartOptions, ChartOptions){
    		
    		$scope.page = "Sachin Stats";

			$(".sachinStat").animate({
		    	height: "550px"
		  	}, 1500 );
    		
    		Data.get_local('scripts/lib/trafficComp.json').success(function(api_data){
    			$scope.matches = get_pie_chart_data(api_data.res['2013'], PieChartOptions);
                $scope.runs = get_pie_chart_data(api_data.res['2012'], PieChartOptions);
//                $scope.chosenStat = get_pie_chart_data(api_data.res['2012'], PieChartOptions);

    		});

    		Data.get_local('scripts/lib/sachin_odi.json').success(function(api_data){
    			$scope.scoreBuckets = getScoreBuckets(api_data, PieChartOptions);
    			$scope.winLoss = getWonLost(api_data, PieChartOptions);
    			$scope.centuryVsBattingOrder = getCenturyVsBattingOrder(api_data, PieChartOptions);

    		});
    
        Data.get_local('scripts/lib/sachin_odi.json').success(function(api_data){
            $scope.winLoss = getWonLost(api_data, PieChartOptions);
        });

            Data.get_local('scripts/lib/sachin_odi.json').success(function(api_data){
                $scope.winLoss = getWonLost(api_data, PieChartOptions);
            });

            Data.get_local('scripts/lib/record_json.json').success(function(api_data){
                $scope.recordChart = get_bubble_chart_data(api_data, colors, ChartOptions)
            });
        });
