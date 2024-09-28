def baseNutrReqr(gender, height, age, weight, act_lvl):
    """
    gender: str
    height: float
    age: int
    weight: kg
    act_lvl: str
    
    all numbers are in metric units
    """

    bmr = 0 # calculate BMR
    match gender:
        case "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        case "female":
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

    tdee = 0 # calculate TDEE (calories)
    match act_lvl:
        case "sedentary":
            tdee = bmr * 1.2
        case "lightly active":
            tdee = bmr * 1.375
        case "moderately active":
            tdee = bmr * 1.55
        case "very active":
            tdee = bmr * 1.725
        case "super active":
            tdee = bmr * 1.9
    
    calories = tdee # grams per day
    
    protein = 2.2 * weight # grams per day

    fat = calories * 0.25 / 9 # grams per day

    carbs = (calories - (protein * 4 + fat * 9)) / 4 # grams per day

    sodium = 2.3 # grams

    fiber = 25 # grams

    sugar = 0.1 * calories # grams

    return [calories, protein, fat, carbs, sodium, fiber, sugar]