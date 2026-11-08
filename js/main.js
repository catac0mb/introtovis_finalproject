let allMatches = [];


async function main() {

    const likes = await d3.csv("data/match_likes.csv");
    const skips = await d3.csv("data/match_skips.csv");
    const blocks = await d3.csv("data/match_blocks.csv");
    const messages = await d3.csv("data/chat_message.csv");

    allMatches = makeMatches(messages);
    const monthlyTotals = makeMonthlyTotals(likes, skips, blocks, allMatches);

    drawBarChart(monthlyTotals);
    updateNetworkGraph();

    // on checkbox changes redraw the graph
    d3.selectAll("input").on("change", updateNetworkGraph);
}


// filters the matches based on the checked boxes and redraws the network graph
function updateNetworkGraph() {
    const checkedMonths = getCheckedValues("month");
    const checkedSentiments = getCheckedValues("sentiment");

    const visibleMatches = allMatches.filter(match =>
      checkedMonths.includes(match.month) && checkedSentiments.includes(match.sentiment)
    );

    drawNetworkGraph(visibleMatches);
}


// returns an array of the values of all checked checkboxes with the given name
function getCheckedValues(name) {
    const values = [];
    const checkedBoxes = document.querySelectorAll("input[name='" + name + "']:checked");

    for (const box of checkedBoxes) {
      values.push(box.value);
    }

    return values;
}


main();
