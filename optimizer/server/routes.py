from flask import Blueprint, request, jsonify
from functions.maxProteinCalories import maxProteinCalories
from functions.baseNutrReqr import baseNutrReqr

routes = Blueprint('routes', __name__)

def determine_weighting(meals):
    match meals:
        case ["Breakfast"]: return 0.2
        case ["Lunch"]: return 0.8
        case ["Dinner"]: return 0.4
        case _: return None

@routes.route('api/recMenu', methods=['GET','POST'])
def getRecMenu():
    if request.method == 'GET':

        locationMenu = request.args.get('locationMenu')
        # dietType = request.args.get('dietType')
        # userData = request.args.get('userData')
        mealTime = request.args.get('mealTime')
        # nutReqr = baseNutrReqr(userData[0], userData[1], userData[2], userData[3], userData[4])

        weighting = determine_weighting(mealTime)
        # if weighting != None:
        #     weightNutReqr = [weighting * i for i in nutReqr]
        # else:
        #     return jsonify("incorrect time")
        
        # guess = []
        
        # match dietType:
        
        #     case "maxProteinCalories":
                
        #         guess = maxProteinCalories(locationMenu, weightNutReqr)
        #         guess = maxProteinCalories(locationMenu, weightNutReqr, guess)

        #     case _:
        #         return jsonify("diet not found")
    
        # return jsonify(guess)