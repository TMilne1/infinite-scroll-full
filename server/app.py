from flask import Flask,jsonify
import json

app = Flask(__name__)

import_file = open('dataSet.json')
data_set = json.load(import_file)

@app.route('/pins', methods=['GET'])
def get_all_pins():
    return jsonify(pins = data_set)

@app.route('/pins/page/<int:page_number>', methods=['GET'])
def get_pins_by_page(page_number):
    if page_number > 5 or page_number < 1:
        return jsonify(),404
    end = page_number * 10
    start = end - 10
    #note: dataset is only 48 items long but the [:] will only go up to the last element. 
    # so on page 5 ([40:50]) the call to elements 48 and 49 are ignored and an error is not triggered
    return jsonify(pins = data_set[start:end])


@app.route('/pins/<id>', methods=['GET'])
def get_pins_by_ID(id):
    for obj in data_set:
        if obj['id'] == id:
            return jsonify(pin = obj), 200 
    return jsonify(),404
     
import_file.close()