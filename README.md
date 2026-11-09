# Milestone 1

# TODO

- [x] 1. Finish process book sections. Totally missing: Related Work, Questions, Exploratory Data Analysis, Implementation, Evaluation. Needs improvement: Design evolution.
- [x] 2. Add tooltips to bar chart showing exact liked, skipped, blocked, and match count
- [ ] 3. Decide how to show how sentiments were determined. Some ideas: 
    1) keep hardcoded sentiment analysis and show side panel with all messages to a given match. Words and phrases with a particular sentiment will be highlighted and labeled as contributing to an overall sentiment score. 
    2) link to an LLM and have it score the entire conversation. Create new page with a detailed analysis of the match (sentiment over time, word cloud of words/phrases, etc.)
    3) link to an LLM, have it score the conversation but still show messages panel. Figure out some
    explainability element that shows how the LLM determined the sentiment score. 

    Note: This work is left for the remaining visualization which will present a focused view of how sentiment with one match developed over time. It'll show specific words contributing to a certain sentiment, placed along an intuitive time scale to show timeline.

- [x] 4. Let the user filter the bar chart to only show liked, skipped, and/or blocked at a time. Right now, if a section is very small compared to the others, it gets squashed. If we can filter, then 
we can show small sections individually and the numbers will be more clear.
