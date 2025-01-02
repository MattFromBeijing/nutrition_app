import numpy as np
from scipy.optimize import minimize

def maxProteinCalories(all_dishes, nutReq, init_guess=None):
    """
    all_dishes: dict with arrays representing location's menu
    nutReq: dict representing user's nutrition requirements, 
    """

    print(nutReq)
    
    dishes = [item['name'] for item in all_dishes]
    calories = [item['calories'] if item['calories'] != 'n/a' else 0 for item in all_dishes]
    protein = [item['protein'] if item['protein'] != 'n/a' else 0 for item in all_dishes]
    fiber = [item['dietaryFiber'] if item['dietaryFiber'] != 'n/a' else 0 for item in all_dishes]
    fat = [item['totalFat'] if item['totalFat'] != 'n/a' else 0 for item in all_dishes]
    sugar = [item['sugars'] if item['sugars'] != 'n/a' else 0 for item in all_dishes]
    carbs = [item['totalCarb'] if item['totalCarb'] != 'n/a' else 0 for item in all_dishes]

    # Set daily constraints here:
    min_calories = nutReq[0]
    min_protein = nutReq[1]
    max_fat = nutReq[2]
    max_carbs = nutReq[3]
    max_sodium = nutReq[4]
    min_fiber = nutReq[5]
    max_sugar = nutReq[6]

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
        return max(0, np.dot(carbs, x) - max_carbs) * carbs_penalty_weight

    # Constraint functions
    def fiberConstraint(x):
        return np.dot(fiber, x) - min_fiber

    def fatConstraint(x):
        return max_fat - np.dot(fat, x)

    def sugarConstraint(x):
        return max_sugar - np.dot(sugar, x)

    # def caloricConstraint(x):
    #     return np.dot(calories, x) - min_calories

    # def proteinConstraint(x):
    #     return np.dot(protein, x) - min_protein

    # def carbConstraint(x):
    #     return max_carbs - np.dot(carbs, x)

    # Combines all of the constraints so it can be passed into the minimize function
    constraints = [
        # {'type': 'ineq', 'fun': caloricConstraint},
        # {'type': 'ineq', 'fun': proteinConstraint},
        {'type': 'ineq', 'fun': fiberConstraint},
        {'type': 'ineq', 'fun': fatConstraint},
        {'type': 'ineq', 'fun': sugarConstraint},
        # {'type': 'ineq', 'fun': carbConstraint}
    ]

    # Objective Functions
    def initObjective(x): # Maximizes protein, fiber, carbs, and calories
        penalties = protein_penalty(x)
        macro_minimize = np.dot(fat, x) + np.dot(sugar, x) + np.dot(carbs, x)
        return macro_minimize + penalties

    # Initial guess (equal distribution)
    x0 = np.zeros(len(all_dishes))
    if init_guess is not None:
        x0 = init_guess

    # Minimize fats, sugars, and carbs
    solution1 = minimize(initObjective, x0, bounds=bnds, constraints=constraints, method='SLSQP')

    x_opt1 = solution1.x

    def finalObjective(x):
        penalties = protein_penalty(x) + caloric_penalty(x) + carb_penalty(x)
        macro_maximize = -np.dot(calories, x) - np.dot(protein, x) - np.dot(fiber, x)
        return macro_maximize + penalties

    # Minimize the negative of protein and fiber
    solution2 = minimize(finalObjective, x_opt1, bounds=bnds, constraints=constraints, method='SLSQP')

    # Final optimized decision variables
    finalSolution = solution2.x
    selected_all_dishes = [(dishes[i], all_dishes[i], round(finalSolution[i])) for i in range(len(all_dishes)) if finalSolution[i] > 0.5]

    if init_guess is None:
        return finalSolution
    else:
        # print(selected_all_dishes)
        return selected_all_dishes
