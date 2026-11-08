// bar chart

const bar_colors = {
  liked: "#eb6834",   
  skipped: "#2a78d6", 
  blocked: "#1baf7a" 
};


function drawBarChart(monthlyTotals) {
  const width = 700;
  const height = 400;
  const margin = 60;   //make space for axes

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //x scale
  const x = d3.scaleBand()
    .domain(monthlyTotals.map(d => d.month))
    .range([margin, width - margin])
    .padding(0.3);

  //y scale
  const biggestBar = d3.max(monthlyTotals, d => d.liked + d.skipped + d.blocked);
  const y = d3.scaleLinear()
    .domain([0, biggestBar])
    .range([height - margin, margin]);

  //make axes
  svg.append("g")
    .attr("transform", "translate(0, " + (height - margin) + ")")
    .call(d3.axisBottom(x).tickFormat(monthLabel));

  svg.append("g")
    .attr("transform", "translate(" + margin + ", 0)")
    .call(d3.axisLeft(y));

  // draw bars
  for (const d of monthlyTotals) {
    let bottom = 0;   // will increase as we draw each piece of the bar

    for (const category of ["liked", "skipped", "blocked"]) {
      const amount = d[category];

      svg.append("rect")
        .attr("x", x(d.month))
        .attr("width", x.bandwidth())
        .attr("y", y(bottom + amount))                    //top of this piece
        .attr("height", y(bottom) - y(bottom + amount))   //how tall it is
        .attr("fill", bar_colors[category])
        .append("title")                                  //shows when you hover
        .text(monthLabel(d.month) + ": " + amount + " " + category);

      bottom = bottom + amount;   //the next piece sits on top of this one
    }

    //number of matches label
    svg.append("text")
      .attr("x", x(d.month) + x.bandwidth() / 2)
      .attr("y", y(bottom) - 8)
      .attr("text-anchor", "middle")
      .text(d.matches + " matches");
  }
}
