from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from functions.maxProteinCalories import maxProteinCalories
from functions.baseNutrReqr import baseNutrReqr
import json

routes = Blueprint('routes', __name__)

def determine_weighting(meals):
    match meals:
        case "Breakfast": return 0.2
        case "Lunch": return 0.8
        case "Dinner": return 0.4
        case _: return None

@routes.route('api/recMenu', methods=['GET','POST'])
def getRecMenu():
    if request.method == 'GET':

        locationMenu = json.loads(request.args.get('locationMenu'))
        dietType = request.args.get('dietType')
        userData = json.loads(request.args.get('userData'))
        mealTime = request.args.get('mealTime')
        nutReqr = baseNutrReqr(str(userData[0]), float(userData[1]), int(userData[2]), float(userData[3]), str(userData[4]))

        all_dishes = []
        for category in locationMenu:
            all_dishes.extend(locationMenu[category])

        print(f"all_dishes: {all_dishes}\n dietType: {dietType}\n userData: {userData}\n mealTime: {mealTime}")

        weighting = determine_weighting(str(mealTime))
        if weighting != None:
            weightNutReqr = [weighting * i for i in nutReqr]
        else:
            return jsonify("incorrect time")
        
        guess = []
        
        match dietType:
        
            case "maxProteinCalories":
                
                guess = maxProteinCalories(all_dishes, weightNutReqr)
                guess = maxProteinCalories(all_dishes, weightNutReqr, guess)

            case _:
                return jsonify("diet not found")
    
        print(guess)
        return jsonify(guess)