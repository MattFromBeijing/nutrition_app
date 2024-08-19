from flask import Blueprint, request, jsonify
from functions.bulking import bulking

routes = Blueprint('routes', __name__)

# @routes.route('/test', methods=['GET','POST'])
# def test():
#     print("request recieved!")
#     data = 'request returned'
#     return jsonify(data)

def determine_weighting(meals):
    match meals:
        case ["Breakfast"]: return [1, 0, 0]
        case ["Lunch"]: return [0, 1, 0]
        case ["Dinner"]: return [0, 0, 1]
        case ["Breakfast", "Lunch"]: return [0.2, 0.8, 0]
        case ["Breakfast", "Dinner"]: return [0.2, 0, 0.8]
        case ["Lunch", "Dinner"]: return [0, 0.6, 0.4]
        case _: return None

@routes.route('/getRecMenu', methods=['GET','POST'])
def getRecMenu():
    if request.method == 'GET':

        response = {"Breakfast", "Lunch", "Dinner", "error"}

        locationMenu = request.args.get('locationMenu')
        dietType = request.args.get('dietType')
        userData = request.args.get('userData')
        selectedMeals = request.args.get('selectedMeals')

        # either our own function or an api call from external website to get nutReq
        # nutReq = function(userData, dietType)
            
        weighting = determine_weighting(selectedMeals)
        breakfastPortion = [weighting[0] * i for i in nutReq]
        lunchPortion = [weighting[1] * i for i in nutReq]
        dinnerPortion = [weighting[2] * i for i in nutReq]
        
        init_guess = []
        fullMenu = []
        finalOpt = None
        
        match dietType:
        
            case "bulking":
                
                if sum(breakfastPortion):
                    init_guess += bulking(locationMenu.Breakfast, breakfastPortion)
                    fullMenu += locationMenu.Breakfast
                if sum(lunchPortion):
                    init_guess += bulking(locationMenu.Lunch, lunchPortion)
                    fullMenu += locationMenu.Lunch
                if sum(dinnerPortion):
                    init_guess += bulking(locationMenu.Dinner, dinnerPortion)
                    fullMenu += locationMenu.Dinner
                
                finalOpt = bulking(fullMenu, nutReq, init_guess)
            
            case _:
                return jsonify(response)
        
        if finalOpt != None:
            for item in finalOpt:
                if item[1] in locationMenu.Breakfast and weighting[0] != 0:
                    response["Breakfast"] += item
                elif item[1] in locationMenu.Lunch and weighting[1] != 0:
                    response["Lunch"] += item
                elif item[1] in locationMenu.Dinner and weighting[2] != 0:
                    response["Dinner"] += item
                else:
                    response["error"] += item
    
        return jsonify(response)