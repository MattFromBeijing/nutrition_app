import json
import numpy as np

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def parse_nutritional_info(data):
    dishes = []
    calories = []
    protein = []
    fiber = []
    fat = []
    sugar = []
    carbs = []

    for item in data:
        dishes.append(item['link'])
        calories.append(float(item['Calories']) if item['Calories'] else 0)
        protein.append(float(item['Protein'].replace('g', '')) if item['Protein'] else 0)
        fiber.append(float(item['Dietary Fiber'].replace('g', '')) if item['Dietary Fiber'] else 0)
        fat.append(float(item['Total Fat'].replace('g', '')) if item['Total Fat'] else 0)
        sugar.append(float(item['Sugars'].replace('g', '')) if item['Sugars'] else 0)
        carbs.append(float(item['Total Carb'].replace('g', '')) if item['Total Carb'] else 0)

    return {
        'dishes': np.array(dishes),
        'calories': np.array(calories),
        'protein': np.array(protein),
        'fiber': np.array(fiber),
        'fat': np.array(fat),
        'sugar': np.array(sugar),
        'carbs': np.array(carbs)
    }



if __name__ == "__main__":
    filename = 'C:/Users/jzhou16/Desktop/Nutrition/Optimization/fullMenu.json'  # Replace with your JSON file path
    data = load_json(filename)
    nutritional_info = parse_nutritional_info(data)

    #Will save the nutrtion info inot a numpy file for optimizationt to use
    np.save('nutritional_info.npy', nutritional_info)
