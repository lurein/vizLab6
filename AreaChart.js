export default function AreaChart(container){

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

    const brush = d3
        .brushX()
            .extent([[0, 0], [width, height]])
            .on("brush", brushed)
            .on("end", brushended);

    const gb = svg.append("g").attr('class', 'brush').call(brush);

    const defaultSelection = [0,width];

    const listeners = { brushed: null };

    function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
        }
      }

    function brushended(event) {
    if (!event.selection) {
        gb.call(brush.move, defaultSelection);
    }
    }

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
    
    function on(event, listener) {
		listeners[event] = listener;
  }

	return {
        update,
        on
	};
}
