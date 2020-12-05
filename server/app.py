from flask import Flask, jsonify, make_response, send_file, render_template, request
import json

app = Flask(__name__, static_folder="../build", template_folder="../build")

# -------------------------------------------------------------------------- #
#                            Frontend Endpoints                              #
# -------------------------------------------------------------------------- #
'''
    These endpoints serve bundle.js, at which points react-router takes over
    routing and displays the correct components based on the url.
    These endpoints are NOT meant to be used in development, which serves
    the frontend via a dev-server at localhost:3000 instead of bundle.js.
'''

@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')

@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")

# -------------------------------------------------------------------------- #
#                                API Endpoints                               #
# -------------------------------------------------------------------------- #
'''
    These API endpoints can be used to GET/POST information between the
    front and back ends.
'''

@app.route('/api/user', methods=['GET'])
def get_user():
    user = {
        'id': '03qed',
        'name': 'Jessica',
        'maps': [{ 'id': 'l23kd', 'name': 'Dummy Map' }],
        'directories': [{
            'id': '5532f',
            'name': 'My Maps',
            'mapIds': ['l23kd']
        }]
    }
    return jsonify(user)