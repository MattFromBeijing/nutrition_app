from flask import Blueprint, request, jsonify
from functions.bulking import bulking

routes = Blueprint('routes', __name__)

# @routes.route('/test', methods=['GET','POST'])
# def test():
#     print("request recieved!")
#     data = 'request returned'
#     return jsonify(data)

@routes.route('/getRecMenu', methods=['GET','POST'])
def getRecMenu():
    if request.method == 'GET':
        response = []

        locationMenu = request.args.get('locationMenu')
        dietType = request.args.get('dietType')
        userData = request.args.get('userData')

        if dietType == 'bulking':
            # either our own function or a api call from external website to get nutReq
            response = bulking(locationMenu, nutReq)
    
    return jsonify(response)