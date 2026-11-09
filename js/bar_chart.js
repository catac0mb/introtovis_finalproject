// bar chart

const bar_colors = {
  liked: "#eb6834",   
  skipped: "#8c02e2", 
  blocked: "#1baf7a" 
};

const bar_legend = {
  liked: "Liked",
  skipped: "Skipped",
  blocked: "Blocked"
};
 

// legend doubles as the filter: one checkbox per interaction type (drawn once)
function drawBarLegend() {
  const legend = d3.select("#bar-legend");

  for (const category of ["liked", "skipped", "blocked"]) {
    const label = legend.append("label");

    label.append("input")
      .attr("type", "checkbox")
      .attr("name", "category")
      .attr("value", category)
      .property("checked", true);

    //square
    label.append("span")
      .attr("class", "key")
      .style("background", bar_colors[category]);

    label.append("span")
      .text(" " + bar_legend[category]);
  }
}

// tooltip text for one month: a line per checked category, then the total
// ex. "Jul 2026 / Liked: 32 / Skipped: 2097 / Blocked: 932 / Total: 3061 / Matches: 11"
function barTooltipText(d, categories) {
  let text = "<strong>" + monthLabel(d.month) + "</strong>";
  let total = 0;

  for (const category of categories) {
    text = text + "<br>" + bar_legend[category] + ": " + d[category].toLocaleString();
    total = total + d[category];
  }

  text = text + "<br><strong>Total: " + total.toLocaleString() + "</strong>";
  text = text + "<br>Matches: " + d.matches;
  return text;
}

// categories = which interaction types to stack, ex. ["liked", "blocked"]
function drawBarChart(monthlyTotals, categories) {
  // clear the old chart before redrawing
  d3.select("#bar-chart").html("");
  d3.select(".d3-tip").style("opacity", 0);   // hide a tooltip left over from a removed bar

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

  //y scale: only count the checked categories, so small ones (like "liked") get rescaled to fill the chart
  const biggestBar = d3.max(monthlyTotals, d => d3.sum(categories, category => d[category])) || 1;  // || 1 avoids an empty domain when nothing is checked
  const y = d3.scaleLinear()
    .domain([0, biggestBar])
    .nice()
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

    for (const category of categories) {
      const amount = d[category];

      svg.append("rect")
        .attr("x", x(d.month))
        .attr("width", x.bandwidth())
        .attr("y", y(bottom + amount))                    //top of this piece
        .attr("height", y(bottom) - y(bottom + amount))   //how tall it is
        .attr("fill", bar_colors[category])
        .on("mouseover", function(event) {
            //Get the X and Y position of the mouse
            let xPosition = event.pageX + 10;
            let yPosition = event.pageY - 10;

            //Update the tooltip position and value
            d3.select(".d3-tip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .html(barTooltipText(d, categories));

            //Show the tooltip
            d3.select(".d3-tip").style("opacity", 1);
        })
        .on("mouseout", function() {
            //Hide the tooltip
            d3.select(".d3-tip").style("opacity", 0);
        });

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
