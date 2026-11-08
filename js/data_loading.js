// data processing


//slice timestamp: ex. "2026-07-11T19:20:47.156Z"  to  "2026-07" (might have bugs if timestamp doesn't have this structure)
function getMonth(timestamp) {
    return timestamp.slice(0, 7);
}


// turn number of a month into a label (hardcoded)
function monthLabel(month) {
    const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = month.slice(0, 4);          
    const monthNumber = Number(month.slice(5));
    return names[monthNumber - 1] + " " + year;
}


// count interactions per month
function countByMonth(rows) {
    const counts = {};

    for (const row of rows) {
        const month = getMonth(row.timestamp);
        if (counts[month] === undefined) {
          counts[month] = 0;
        }
        counts[month] = counts[month] + 1;
    }

    return counts;
}


// Groups the messages by match and scores each conversation.
// returns a list:
// [ { id: "match_12", 
      // name: "M12", 
      // month: "2026-08", 
      // messageCount: 0,
      // averageScore: 0, 
      // sentiment: "Flirty" }]

function makeMatches(messages) {
    const matches = {};

    for (const row of messages) {
        const id = row.match_id;

        //create entry if haven't seen match before
        if (matches[id] === undefined) {
            matches[id] = {
                id: id,
                name: "M" + id.replace("match_", ""),   //"match_12" -> "M12"
                month: getMonth(row.timestamp),       //month of the first message
                messageCount: 0,
                totalScore: 0
            };
        }

        matches[id].messageCount = matches[id].messageCount + 1;
        matches[id].totalScore = matches[id].totalScore + scoreMessage(row.message);
    }

    // get the values of the matches object as a list, so we can sort it and return it
    const matchList = Object.values(matches);

    for (const match of matchList) {
        match.averageScore = match.totalScore / match.messageCount;
        match.sentiment = getSentiment(match.averageScore);
    }

    return matchList;
}


//build one row per month for the bar chart:
// [ { month: "2026-07", 
        // liked: 5, 
        // skipped: 5, 
        // blocked: 5, 
        // matches: 5 }, ... ]
function makeMonthlyTotals(likes, skips, blocks, matches) {
    const likeCounts = countByMonth(likes);
    const skipCounts = countByMonth(skips);
    const blockCounts = countByMonth(blocks);
    const matchCounts = countByMonth(matches.map(match => ({ timestamp: match.month })));

    // make a list of every month that shows up in any file.
    const months = [];
      for (const counts of [likeCounts, skipCounts, blockCounts]) {
          for (const month in counts) {
              if (!months.includes(month)) {
                months.push(month);
              }
          }
      }
    months.sort();

    //use 0 if a month doesn't have any of a certain type of interaction
    return months.map(month => ({
        month: month,
        liked: likeCounts[month] || 0,
        skipped: skipCounts[month] || 0,
        blocked: blockCounts[month] || 0,
        matches: matchCounts[month] || 0
    }));
}
