//line length  = how flirty (shorter = flirtier)
//circle color = Flirty / Neutral / Cold
//circle size  = how many messages sent

const colors = {
  Flirty: "#e50095",  
  Neutral: "#9a9893", 
  Cold: "#2a78d6"    
};


function drawNetworkGraph(matches) {

  console.log("drawNetworkGraph match input", matches);

  const width = 700;
  const height = 500;

  // clear
  d3.select("#network-graph").html("");

  const svg = d3.select("#network-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // score => inverse of line length
  const lineLength = d3.scaleLinear()
    .domain([-0.4, 0.6])
    .range([220, 60])


  // fix user in the center
  const user = { id: "user", name: "User", fx: width / 2, fy: height / 2, messageCount: 50 };
  const nodes = [user].concat(matches); // add the matches to the list of nodes

  console.log("drawNetworkGraph nodes", nodes);

  // make edges
  const links = matches.map(match => ({
    source: "user",
    target: match.id,
    length: lineLength(match.averageScore),
    color: colors[match.sentiment]
  }));

  const lines = svg.selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", d => d.color)
    .attr("stroke-width", 2);

  const circles = svg.selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", d => 6 + d.messageCount / 3)
    .attr("fill", d => d.id === "user" ? "white" : colors[d.sentiment])
    .attr("stroke", "black");

  const labels = svg.selectAll("text")
    .data(nodes)
    .join("text")
    .attr("text-anchor", "middle")
    .text(d => d.name);

  // force simulation to position the nodes and edges
  d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.length))
    .force("push", d3.forceManyBody().strength(-100))
    .force("collide", d3.forceCollide(30))
    .on("tick", () => {
      // every tick move the shapes to their new positions.
      lines
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y - (6 + d.messageCount / 3) - 5);  
    });
}
