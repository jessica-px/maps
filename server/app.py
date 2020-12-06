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
    }
    return jsonify(user)

@app.route('/api/directories', methods=['GET'])
def get_directories():
    #userId = request.args.get("userId") # not currently used, but it'll be needed to do the real query
    directories = [
        {
            'id': '5532f',
            'name': 'My Map Folder',
            'maps': [
                {'name': 'Dummy Map', 'id': 'l23kd'},
                {'name': 'Test Map', 'id': '7e3ax'},
            ]
        }
    ]
    return jsonify(directories)

maps = [
    {
        "id": '7e3ax',
        "name": 'Test Map',
        "description": 'This is a map for testing.',
        "imageUrl": 'https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg',
        "ownerId": '03qed',
        "activeRoomId": '634re',
        "roomList": [ {
            "id": '634re',
            "listPosition": 1,
            "name": 'Slime Pit',
            "description": 'This is a highly suspicious pit full of slime.'
        }],
        "markerList": [
        {
            "id": '634re',
            "position": [54, 70]
        }
        ]
    },
    {
        "id": 'l23kd',
        "name": 'Dummy Map',
        "description": 'This is a map for testing.',
        "imageUrl": 'https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg',
        "ownerId": '03qed',
        "activeRoomId": '332e3',
        "roomList": [
            {
                "id": '332e3',
                "listPosition": 1,
                "name": 'Barracks',
                "description": '''## Description
                \nFifteen straw mattresses are placed around the room, each with a small wooden chest at its foot. A long table is in the center of the room, with benches to each side. Four lizardfolk warriors receive orders from a heavily armored officer. Another lizardfolk dressed in a robe stands to one side, observing the assembly.
                \n## Creatures
                \nIf they have not been called elsewhere, four **lizard folk**, one **lizardfolk scaleshield**, and one **lizardfolk shaman** prepare for patrol in this room.
                \nIf the party arrives here accompanied by friendly lizardfolk, the shaman initially urges the guards to attack. A successful DC 15 Charisma (Persuasion) check by a character prevents a fight, and instead the lizardfolk take the characters  in custody and take them to meet the queen.
                \n## Treasure
                \nThe chests are unlocked and contain personal possessions. Five of the chests each contain a purse with 6 sp. Three of the other chests hold a whet stone, a dagger in a scabbard, and a crude wooden carving of a crocodile.
                \n## Exits
                \nThe northern door connects to a long hallway -- within sight are doors to the [Storage Room](23e21) and [Officer's Quarters](9cws2). Around a corner are doors to the Alligator Pit and Lunch Hall.
                '''
            },
            {
                "id": '23e21',
                "listPosition": 3,
                "name": 'Storage Room',
                "description": '''## Description
                \nHanging from hooks set into the ceiling are **six carcasses** of various shapes and sizes. Against the south and west walls are a collection of crates, baskets, and barrels filled with fruit, oil, salt, and pickled meat. Against the east wall is a large wooden cage in which squawk a dozen irritable waterfowl.
                \n## Carcasses
                \nThe carcasses include:
                \n- a manta ray
                \n- a giant frog
                \n- an adult male hobgoblin
                \n- two sharks
                \n- a giant crayfish
                \nOne of the sharks has a mostly smashed armor plate embedded in its side. The plate is made from coral and wood and appears to have been driven into the creature. If Oceanus is with the party, he identifies the shark's armor as of sahuagin manufacture and relates that animals like this serve the sahuagin as war beasts. Jn his absence, a character can glean the same information with a successful DC 14 Intelligence (Nature) check. 
                \n## Exits
                \n The eastern door opens into a long hallway -- within sight are doors to the [Barracks](332e3) and [Officer's Quarters](9cws2). Around a corner are doors to the Alligator Pit and Lunch Hall.
                '''
            },
            {
                "id": '9cws2',
                "listPosition": 2,
                "name": 'Officer\'s Quarters',
                "description": '''## Description
                \nA wooden table against the north wall is set with an earthenware jug of cider and a wooden cup. A wooden chair stands by the table. A bed stands against the west wall with a brass-bound, wooden chest against its foot.
                \n## Creatures
                \nAn officer (a **lizardfolk scaleshield**) sits on the bed, sharpening their sword. They leap up, ready to fight, as soon as the characters enter.
                \nIf the characters have avoided combat to this point, the lizardfolk in the [Barracks](1) join the officer in this room when they hear sounds of combat.
                \n## Treasure
                \n The chest is locked and can be opened by a character who makes a successful DC 12 Dexterity check using thieves' tools or who has the key. It contains personal possessions, a purse containing 25 ep, a dagger in a scabbard, and a leather whip. The officer carries the key to the chest and he wears a silver collar (15 gp).
                \n## Exits
                \n The northern door opens into a long hallway -- within sight are doors to the [Barracks](332e3) and [Store Room](23e21). Around a corner are doors to the Alligator Pit and Lunch Hall.
                \n South is a passage leading to the Armory.
                '''
        }
    ],
    "markerList": [
        {
            "id": '332e3',
            "position": [54, 70]
        },
        {
            "id": '23e21',
            "position": [65, 35]
        },
        {
            "id": '9cws2',
            "position": [30, 70]
        }
    ]
    }
]

@app.route('/api/map', methods=['GET'])
def get_map():
    map_id = request.args['id']
    for map_data in maps:
        if map_data["id"] == map_id:
            return jsonify(map_data)
