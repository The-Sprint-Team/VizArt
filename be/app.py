import os
import random
import string
import base64
from datetime import datetime
from flask import Flask, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="static")
CORS(app)

# Upload to static directory so we can serve the files.
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__name__), "static")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


def genname(k=8) -> str:
    return "".join(random.choices(string.ascii_letters, k=k))


def fileinfo(uid: str):
    base = os.path.join(app.config["UPLOAD_FOLDER"], uid)
    time = datetime.fromtimestamp(os.path.getmtime(base))
    with open(os.path.join(base, "name.txt"), "r") as f:
        name = f.read()
    return {
        "name": name,
        "vid": os.path.join(base, "vid.mp4"),
        "thumb": os.path.join(base, "thumb.png"),
        "time": time.astimezone().isoformat(),
    }


@app.route("/videos", methods=["GET"])
def files_index():
    base = app.config["UPLOAD_FOLDER"]
    return {k: fileinfo(k) for k in os.listdir(base)}


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return "No file provided", 400

    if "thumb" not in request.form:
        return "Thumbnail not provided", 400

    if "name" not in request.form:
        return "No name provided", 400

    file = request.files["file"]
    name = request.form["name"]
    thumb = request.form["thumb"]

    uid = genname()
    path = os.path.join(app.config["UPLOAD_FOLDER"], uid)

    os.makedirs(path, exist_ok=True)
    file.save(os.path.join(path, "vid.mp4"))

    with open(os.path.join(path, "thumb.png"), "wb") as f:
        buf = base64.b64decode(thumb)
        f.write(buf)

    with open(os.path.join(path, "name.txt"), "w") as f:
        f.write(name)

    return {"uid": uid}
