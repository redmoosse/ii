from model import BioModel
from model_server import ModelServer

if __name__ == "__main__":
    model = BioModel()
    server = ModelServer(model)
    server.run()