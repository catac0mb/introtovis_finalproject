// Hardcoded list of flirty and cold words

// might want to replace with LLM call


// decides conversation sentiment based on the average score of all messages in that conversation
//count flirty words (+1) and cold words (-1) in each message.

// hardcoded list of flirty and cold words
const flirty = [
  "smooch", "kiss", "babe", "date", "invitation", "cute", "sweet",
  "lovely", "husband", "diva", "looking forward", "miss me", "winner",
  "promise", "😈", "😌", "🫢", "🤩", "👀", "🫣", "😏", "😘", "😉"
];


const cold = [
  "friendship", "professional", "wish you luck","disappointed", "unfortunately", 
  "sorry", "brutal", "tough", "busy", "😔", "😖", "😩"
];


// Each message gets a single score based on the number of flirty and cold words it contains.
// ex. "Winner gets a smooch 😌" has 3 flirty words => score=3
function scoreMessage(message) {
  const text = message.toLowerCase();
  let score = 0;

  for (const word of flirty) {
    if (text.includes(word)) {
      score = score + 1;
    }
  }

  for (const word of cold) {
    if (text.includes(word)) {
      score = score - 1;
    }
  }

  return score;
}


// turn number into discrete sentiment label: "Flirty", "Neutral", or "Cold"
function getSentiment(averageScore) {
  if (averageScore >= 0.25) {
    return "Flirty";
  }
  if (averageScore <= -0.05) {
    return "Cold";
  }
  return "Neutral";
}
