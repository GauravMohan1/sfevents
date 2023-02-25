# sfevents

# Demo:
https://www.youtube.com/watch?v=rxwWuh-lnuc

# Project Breakdown:
https://gauravamohan.medium.com/sf-event-recommender-using-llms-d1f9e898fd


# Script Descriptions:
clustering: looks for themes in events using transformer models to potentially be used as a feature in embeddings
standardize: combines all the scraped events and reformats to standardize features and emebeddings for models
recommendations: similarity search on event embeddings and user embeddings and storing it in mysql database
index: node.js file for backend to push mysql data to the front end. Dynamically takes liked events and calls update_recs to update table
update recommendations: factors liked events into similarity search to tune recommendations to user's liked events.
