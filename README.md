# Research_Chatbot
Design of an experimental chatbot for academic research purposes. Research was conducted to understand the design and architexture elements, while the code was generated from GPT 5.0 agent who was guided by specific prompts guided by the research.
# Running in a Github Codespace
Follow these steps to set up and run the Rasa assistant in a GitHub Codespace.

Prerequisites:

1. You'll need a Rasa Pro license and an OpenAI API key.
2. You should be familiar with Python and Bash. 

# Steps to Create a Chatbot

# Create a Codespace:
1. Navigate to the repository on GitHub.
2. Click on the green "Code" button, then scroll down to "Codespaces".
3. Click on "Create codespace on main branch".
This should take under two minutes to load.

# Set Up Environment:
Once the Codespace loads, it will look like VSCode but in your browser!
Open a terminal and run source .venv/bin/activate to activate the development environment.

# Install Python extension in Codespace

# Create folders and subfolders for the project using the \\Project\\Framework

# Create a .env folder and add the required keys to that file.
1. export RASA_PRO_LICENSE='your_rasa_pro_license_key_here'
2. export OPENAI_API_KEY='your_openai_api_key_here'

# Create a virutal environment
1. Create virtual environment in the terminal below with this command:
    python3 -m venv .venv
2. Activate environment in the terminal below with this command:  
    source .venv/bin/activate
3. Set-up workspace
    python -m venv .venv
    source .venv/bin/activate 
    pip install rasa[full] faiss-cpu openai fastapi uvicorn python-dotenv



ras# 2) Train NLU/Core
rasa train
# 3) Seed KB & index
python scripts/seed_kb.py
# 4) Start services
rasa run --enable-api --cors "*" --debug
rasa run actions --debug
# 5) Frontend
cd frontend/nextjs-app && npm i && npm run dev

