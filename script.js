import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data => {
	for (var i = 0; i < data.length; i++) {
		var localSum = data[i]["Wholesale and Retail Trade"] + data[i]["Manufacturing"] + data[i]["Leisure and hospitality"] + data[i]["Business services"] + data[i]["Construction"] + data[i]["Education and Health"] + data[i]["Government"] + data[i]["Finance"] + data[i]["Self-employed"] + data[i]["Other"] + data[i]["Transportation and Utilities"] + data[i]["Information"] + data[i]["Agriculture"] + data[i]["Mining and Extraction"]
		data[i]["total"] = localSum
	}
	console.log(data)
	const areaChart = AreaChart(".areaChart");
	areaChart.update(data);
	const stackedChart = StackedAreaChart(".stackedChart");
	stackedChart.update(data);

	areaChart.on("brushed", (range)=>{
		stackedChart.filterByDate(range); // coordinating with stackedAreaChart
	})
});
