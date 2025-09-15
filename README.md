This repository contains a self-contained Rasa chatbot designed for experimental research. It allows you to study how transparency affects privacy concerns in chatbot interactions, with AI literacy as a moderating factor.
These instructions assume you are working on your local computer with VSCode (not GitHub Codespaces). No prior coding background is required. Just follow carefully.


1. Prerequisites
# Before starting, install the following on your computer:
    Docker Desktop
    Visual Studio Code


# VSCode extensions:
    YAML (Red Hat)
    Docker (Microsoft)

# Verify installs
        docker --version
            # You should see a version number (e.g., Docker version 24.0.5).

2. Repository Structure

#research_chatbot/
│── backend/        
│── frontend/       
│── docker-compose.yml
│── README.md       

3. Getting Started
# Call Root Directory
        cd /Users/"name_of_your_computer"/"place_where_folder_is_stored"/"name_of_folder"

# Build and Start all Containers
        docker compose down --remove-orphans
        docker compose build
        docker compose up --build
            # This Starts 
                Rasa API -> http://localhost:5005
                Frontend UI -> http://localhost:3000

4. Debugging with Multiple Terminals
# Keep the main stack running in one terminal, then open additional ones for logs

# Terminal 1 (Orchestrator)
        docker compose up --build

# Terminal 2 (Rasa logs)
        docker compose logs -f rasa

# Terminal 3 (Action Server logs)
        docker compose logs -f action_server

# Terminal 4 (Frontend logs)
        docker compose logs -f frontend

# Health Checks
      curl -s http://localhost:5005/version
        # open http://localhost:3000

5. Training the Chatbot
# When you update intents, stories, or rules:
# optional sanity check
        docker compose run --rm rasa --version
# validate & train
        docker compose run --rm rasa data validate
        docker compose run --rm rasa train


6. Interacting with the Bot
# Open in a browser
        http://localhost:3000

# Ask questions through UI
# Conversations are logged in Postgres automatically

7. Retrieving Conversation from Postgres
# Open a Postgres shell:
        docker compose exec postgres psql -U rasa -d rasa

# List tables:
        \dt

# Inspect the events table (user and bot messages)
        SELECT sender_id, event, timestamp, data
        FROM events
        ORDER BY timestamp DESC
        LIMIT 20;

# Dump all conversation data to a SQL file:
        docker compose exec postgres pg_dump -U rasa -d rasa > conversations.sql

# Export events in json
        docker compose exec postgres psql -U rasa -d rasa -c \
        "SELECT json_agg(events) FROM events;" > conversations.json

7.1 How the events tabls is structured (what the JSON means)
# sender_id - conversation ID (e.g. a participant or session identifier)
# event - event type (e.g. 'user', 'bot', 'action','slot','session_started','conversation_started')
# timestamp - UNIX seconds (float)
# data - JSON payload with event-specific fields (this is the "blob" you'll parse)

8. Experiment Notes
# No external APIs are called; this is safe for participant studies
# Transparency toggles and privacy reminders are configured in:
    backend/domain.yml
    backend/prompts/
# Use Postgres logs for analysis (e.g. MTurk participant data)

9. Troubleshooting
# If containters do not start:
        docker compose --remove-orphans
        docker compose build
        docker compose up --build

# If frontend does not hot reload, ensure:
   frontend/Dockerfile.dev is used in docker-compose.yml

10. Next Step
# Add intents/responses in:
    backend/data/nlu/
    backend/domain.yml

# Add or modify conversation flows in:
    backend/data/stories/

# Export logs form Postgres and run analysis scripts



2. Repository Structure
# Your project should look like this:


calm_bots/
│── backend/
│   ├── data/
│   │   ├── nlu/
│   │   ├── stories/
│   │   ├── rules/
│   ├── domain.yml
│   ├── config.yml
│   ├── endpoints.yml
│   ├── Dockerfile
│
│── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── pages/
│   ├── Dockerfile.dev
│
│── docker-compose.yml
│── README.md  ← (this file)
