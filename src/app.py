from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

openai.api_type = "azure"
openai.api_base = "https://inferenceendpointeastus.openai.azure.com/"
openai.api_version = "2022-06-01-preview"
openai.api_key = "417c5d059f2d47aca2bb66c8122083ec"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8888"}})

class Dialogue:
    def __init__(self):
        self.conversation = ["You are a python tutor helping a beginner programmer to debug.\n"]

    def ask_question(self, question):
        self.conversation.append(f"User: {question}\n")
        self.get_hint()

    def get_hint(self):
        prompt = "".join(self.conversation)
        response = openai.Completion.create(
            engine="athena-text-davinci-003",
            prompt=prompt,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.5
        )
        self.conversation.append(f"Tutor: {response.choices[0].text}\n")

dialogue = Dialogue()

@app.route('/get_response', methods=['POST'])
def get_response():
    query = request.json['query']
    dialogue.ask_question(query)
    hint = dialogue.conversation[-1].replace("Tutor:", "").strip()
    return jsonify({'response': hint})

if __name__ == '__main__':
    app.run(debug=True)

