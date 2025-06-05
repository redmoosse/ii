from flask import Flask, request

class ModelServer:
    def __init__(self, model):
        self.app = Flask(__name__)
        self.model = model
        self._setup_routes()

    def _setup_routes(self):
        @self.app.route("/process", methods=["POST"])
        def process():
            data = request.get_json()
            text = data.get("text", "")
            result = self.model.process(text)
            return result

    def run(self, host="0.0.0.0", port=5000):
        self.app.run(host=host, port=port)
