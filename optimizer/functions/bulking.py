import numpy as np
from scipy.optimize import minimize

def bulking(locationMenu, nutReq):
    """
    locationMenu: location's menu
    nutReq: user's nutrition requirements, 
    """
    
    dishes = [item.name for item in locationMenu]
    calories = [item.Calories for item in locationMenu]
    protein = [item.Protein for item in locationMenu]
    fiber = [item.Fiber for item in locationMenu]
    fat = [item.Fat for item in locationMenu]
    sugar = [item.Sugars for item in locationMenu]
    carbs = [item.Carbs for item in locationMenu]

    # Set daily constraints here:
    min_calories = nutReq.calories
    max_fat = nutReq.fat
    max_sugar = nutReq.sugar
    min_carbs = nutReq.carbs
    min_protein = nutReq.protein
    min_fiber = nutReq.fiber

    # Bounds for each dish (x)
    # In this case, it's going to be binary as choosing one dish one time will maintain food diversity
    bnds = [(0, 3) for _ in dishes]

    # Penalty weights
    protein_penalty_weight = 1000
    calories_penalty_weight = 1000
    carbs_penalty_weight = 500

    # Penalty functions
    def caloric_penalty(x):
        return max(0, min_calories - np.dot(calories, x)) * calories_penalty_weight

    def protein_penalty(x):
        return max(0, min_protein - np.dot(protein, x)) * protein_penalty_weight

    def carb_penalty(x):
        return max(0, min_carbs - np.dot(carbs, x)) * carbs_penalty_weight

    # Constraint functions
    def fiberConstraint(x):
        return np.dot(fiber, x) - min_fiber

    def fatConstraint(x):
        return max_fat - np.dot(fat, x)

    def sugarConstraint(x):
        return max_sugar - np.dot(sugar, x)

    def caloricConstraint(x):
        return np.dot(calories, x) - min_calories

    def proteinConstraint(x):
        return np.dot(protein, x) - min_protein

    def carbConstraint(x):
        return np.dot(carbs, x) - min_carbs

    # Combines all of the constraints so it can be passed into the minimize function
    constraints = [
        {'type': 'ineq', 'fun': caloricConstraint},
        {'type': 'ineq', 'fun': proteinConstraint},
        {'type': 'ineq', 'fun': fiberConstraint},
        {'type': 'ineq', 'fun': fatConstraint},
        {'type': 'ineq', 'fun': sugarConstraint},
        {'type': 'ineq', 'fun': carbConstraint}
    ]

    # Objective Functions
    def initObjective(x): # Maximizes protein, fiber, carbs, and calories
        penalties = protein_penalty(x)
        macro_minimize = np.dot(fat, x) + np.dot(sugar, x)
        return macro_minimize + penalties

    # Initial guess (equal distribution)
    x0 = np.zeros(len(dishes))

    # Minimize fats, sugars, and carbs
    solution1 = minimize(initObjective, x0, bounds=bnds, constraints=constraints, method='SLSQP')

    x_opt1 = solution1.x

    def finalObjective(x):
        penalties = protein_penalty(x) + caloric_penalty(x) + carb_penalty(x)
        macro_maximize = -np.dot(calories, x) - np.dot(protein, x) - np.dot(carbs, x)
        return macro_maximize + penalties

    # Minimize the negative of protein and fiber
    solution2 = minimize(finalObjective, x_opt1, bounds=bnds, constraints=constraints, method='SLSQP')

    # Final optimized decision variables
    finalSolution = solution2.x
    selected_dishes = [(str(dishes[i]), round(finalSolution[i])) for i in range(len(dishes)) if finalSolution[i] > 0.5]

    return selected_dishes
