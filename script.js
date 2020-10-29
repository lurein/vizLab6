d3.csv('unemployment.csv', d3.autoType).then(data => {
	for (var i = 0; i < data.length; i++) {
		var localSum = data[i]["Wholesale and Retail Trade"] + data[i]["Manufacturing"] + data[i]["Leisure and hospitality"] + data[i]["Business services"] + data[i]["Construction"] + data[i]["Education and Health"] + data[i]["Government"] + data[i]["Finance"] + data[i]["Self-employed"] + data[i]["Other"] + data[i]["Transportation and Utilities"] + data[i]["Information"] + data[i]["Agriculture"] + data[i]["Mining and Extraction"]
		data[i]["total"] = localSum
	}
	console.log(data)
	// const areaChart1 = AreaChart(".chart1");
	// areaChart1.update(data);
	const areaChart1 = StackedAreaChart(".chart1");
	areaChart1.update(data);
});

function AreaChart(container){

	// initialization
	// create svg with margin convention
	const margin = ({top: 20, right: 20, bottom: 20, left: 60});
	const width = 700 - margin.left - margin.right;
	const height = 550 - margin.top - margin.bottom;
	const svg = d3.select(container)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("path")
		.attr("class", "pathArea")


	const xScale = d3
		.scaleTime()
		.range([0, width])
	
	const yScale = d3
		.scaleLinear()
		.range([height, 0])

	// drawing the x-axis
	const xAxis = d3.axisBottom()
		.scale(xScale)

	var bottomAxis = svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", `translate(0, ${height})`)
		.call(xAxis);
	
	const yAxis = d3.axisLeft()
		.scale(yScale)
	
	var leftAxis = svg.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", `translate(0, 0)`)
		.call(yAxis);

	function update(data){ 
		// update scales, encodings, axes (use the total count)
		xScale.domain([data[0].date, data[data.length - 1].date]);
		yScale.domain([0, d3.max(data, function(d) { return d.total; })]);
		
		const xAxis = d3.axisBottom()
		.scale(xScale)
	
		const yAxis = d3.axisLeft()
		.scale(yScale)
	
		bottomAxis.call(xAxis)
		leftAxis.call(yAxis)


		svg.selectAll(".pathArea")
      .datum(data)
      .attr("fill", "#cce5df")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(function(d) { return xScale(d.date) })
        .y0(yScale(0))
        .y1(function(d) { return yScale(d.total) })
        )
	}

	return {
		update // ES6 shorthand for "update": update
	};
}

function StackedAreaChart(container) {
	// initialization
	const margin = ({top: 20, right: 20, bottom: 20, left: 60});
	const width = 700 - margin.left - margin.right;
	const height = 550 - margin.top - margin.bottom;
	const svg = d3.select(container)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	const tooltip = svg
		.append("text")
			.attr('x', 0)
			.attr('y', 0)

	const colorScale = d3
		.scaleOrdinal()
		.range(d3.schemeSet2)

	const xScale = d3
		.scaleTime()
		.range([0, width])
	
	const yScale = d3
		.scaleLinear()
		.range([height, 0])

	// drawing the x-axis
	const xAxis = d3.axisBottom()
		.scale(xScale)

	var bottomAxis = svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", `translate(0, ${height})`)
		.call(xAxis);
	
	const yAxis = d3.axisLeft()
		.scale(yScale)
	
	var leftAxis = svg.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", `translate(0, 0)`)
		.call(yAxis);

	function update(data){
		var keys = data.columns.slice(1)
		var stack = d3.stack()
			.keys(keys)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);
		
		var stackedData = stack(data)
		console.log(stackedData)

		// update scales, encodings, axes (use the total count)
		colorScale.domain(keys)
		xScale.domain([data[0].date, data[data.length - 1].date]);
		yScale.domain([0, d3.max(stackedData, 
			d => d3.max(d[1]) // compute the max of the nested array using y1 or d[1]
		)]);

		const area = d3.area()
			.x(function(d) { return xScale(d.data.date) })
			.y0(function(d) { return yScale(d[0]) })
			.y1(function(d) { return yScale(d[1]) })

		
		const areas = svg.selectAll(".area")
			.data(stackedData);
		
		areas.enter() // or you could use join()
			.append("path")
			.attr("class", function(d) { return "myArea " + d.key })
			.style("fill", function(d) { return colorScale(d.key); })
			.merge(areas)
			.attr("d", area)
			.on("mouseover", (event, d, i) => tooltip.text(d.key))
			.on("mouseout", (event, d, i) => tooltip.text(""))
		
		areas.exit().remove();
		
		const xAxis = d3.axisBottom()
		.scale(xScale)
	
		const yAxis = d3.axisLeft()
		.scale(yScale)
	
		bottomAxis.call(xAxis)
		leftAxis.call(yAxis)
	}
	return {
		update
	}
}