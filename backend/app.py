from flask import Flask, request,send_from_directory, Response
from flask_cors import CORS
import requests
#path of the folder
FRONTEND_DIR =r""

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)


RDF4J_URL = "http://localhost:8080/rdf4j-server/repositories/grafexamen"
JSON_REST = "http://localhost:4000"




@app.route("/queryRDF", methods=["POST"])
def query_rdf4j():
    sparql = request.json.get("query", "")
    headers = {
        "Content-Type": "application/sparql-query",
        "Accept": "application/sparql-results+json"
    }
    r = requests.post(RDF4J_URL, data=sparql.encode("utf-8"), headers=headers)
    return Response(r.content, status=r.status_code, content_type=r.headers.get("Content-Type"))


@app.route("/producatoriREST", methods=["GET", "POST"])
def proxy_producatori():
    if request.method == "GET":
        r = requests.get(f"{JSON_REST}/producatori")
    else:
        r = requests.post(f"{JSON_REST}/producatori", json=request.json)
    return Response(r.content, status=r.status_code, content_type=r.headers.get("Content-Type"))


@app.route("/jocuriREST", methods=["GET", "POST"])
def proxy_jocuri():
    if request.method == "GET":
        r = requests.get(f"{JSON_REST}/jocuri")
    else:
        r = requests.post(f"{JSON_REST}/jocuri", json=request.json)
    return Response(r.content, status=r.status_code, content_type=r.headers.get("Content-Type"))


@app.route("/graphql", methods=["POST"])
def proxy_graphql():
    r = requests.post("http://localhost:3000/graphql", json=request.json)
    return Response(r.content, status=r.status_code, content_type=r.headers.get("Content-Type"))




@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)



if __name__ == "__main__":
    app.run(port=5001, debug=True)
