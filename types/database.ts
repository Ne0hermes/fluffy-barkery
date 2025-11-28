export interface Recipe {
    id: string
    user_id: string
    name: string
    description: string | null
    prep_time_minutes: number
    rest_time_minutes: number
    baking_time_minutes: number
    baking_temperature: number | null
    yield_quantity: number
    yield_unit: string
    created_at: string
    updated_at: string
}

export interface Ingredient {
    id: string
    user_id: string
    name: string
    unit: string
    stock_quantity: number
    created_at: string
}

export interface RecipeIngredient {
    id: string
    recipe_id: string
    ingredient_id: string
    quantity: number
    order: number
}

export interface ProductionPlan {
    id: string
    user_id: string
    recipe_id: string
    planned_date: string
    start_time: string
    quantity_multiplier: number
    status: 'planned' | 'in_progress' | 'completed'
    notes: string | null
    created_at: string
}

export interface RecipeWithIngredients extends Recipe {
    recipe_ingredients: (RecipeIngredient & {
        ingredient: Ingredient
    })[]
}

export interface ProductionPlanWithRecipe extends ProductionPlan {
    recipe: Recipe
}
