import os
import random
import string
from flask import Flask, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="static")
CORS(app)

# Upload to static directory so we can serve the files.
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__name__), "static")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Insanely scalable database.
db = {}

def genname(k=8) -> str:
    return ''.join(random.choices(string.ascii_letters, k=k))

@app.route("/files", methods=["GET"])
def files_index():
    return db

@app.route("/files/<path>")
def files_get(uid):
    return send_from_directory('static', uid)

@app.route("/upload", methods=["POST"])
def upload():
    if 'file' not in request.files:
        return 'No file provided', 400

    if 'name' not in request.form:
        return 'No name provided', 400

    name = request.form['name']
    file = request.files['file']
    uid = genname()
    fname = f'{uid}.webm'
    file.save(os.path.join(app.config["UPLOAD_FOLDER"], fname))

    db[uid] = name

    print(db)
    return {'uid': uid}
