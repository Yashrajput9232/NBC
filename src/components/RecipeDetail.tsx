import { X, Clock, Users, ChefHat, Edit, Link as LinkIcon } from 'lucide-react';
import type { Recipe } from '../lib/supabase';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit?: (recipe: Recipe) => void;
}

export default function RecipeDetail({ recipe, onClose, onEdit }: RecipeDetailProps) {
  const totalTime = recipe.prep_time + recipe.cook_time;
  const ingredientsList = recipe.ingredients.split('\n').filter(item => item.trim());
  const instructionsList = recipe.instructions.split('\n').filter(item => item.trim());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-nbc-orange px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-nbc-brown flex-1 mr-4">{recipe.title}</h2>
          <div className="flex gap-2 flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(recipe)}
                className="p-2 hover:bg-nbc-cream rounded-full transition-colors text-nbc-orange hover:text-nbc-brown"
                title="Edit recipe"
              >
                <Edit className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-nbc-cream rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-nbc-brown" />
            </button>
          </div>
        </div>

        <div className="relative h-64 bg-gradient-to-br from-nbc-cream to-nbc-yellow">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="w-32 h-32 text-nbc-tan" />
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {recipe.description && (
            <p className="text-lg text-nbc-brown leading-relaxed">{recipe.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-nbc-cream rounded-lg">
              <span className="font-semibold text-nbc-brown">Category:</span>
              <span className="text-nbc-tan capitalize">{recipe.category}</span>
            </div>
            {totalTime > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-nbc-yellow rounded-lg">
                <Clock className="w-4 h-4 text-nbc-orange" />
                <span className="text-nbc-brown">
                  <span className="font-semibold">Total:</span> {totalTime} min
                  {recipe.prep_time > 0 && ` (Prep: ${recipe.prep_time}m, `}
                  {recipe.cook_time > 0 && `Cook: ${recipe.cook_time}m)`}
                </span>
              </div>
            )}
            {recipe.servings > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-nbc-cream rounded-lg">
                <Users className="w-4 h-4 text-nbc-orange" />
                <span className="text-nbc-brown">
                  <span className="font-semibold">Servings:</span> {recipe.servings}
                </span>
              </div>
            )}
            {recipe.source_link && (
              <a
                href={recipe.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-nbc-tan/20 rounded-lg hover:bg-nbc-tan/30 transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-nbc-orange" />
                <span className="text-nbc-orange font-semibold">View Source</span>
              </a>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-nbc-brown mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-nbc-orange rounded-full"></span>
              Ingredients
            </h3>
            <ul className="space-y-2 bg-nbc-cream rounded-lg p-4">
              {ingredientsList.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-nbc-brown"
                >
                  <span className="w-2 h-2 bg-nbc-orange rounded-full mt-2 flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-nbc-brown mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-nbc-orange rounded-full"></span>
              Instructions
            </h3>
            <ol className="space-y-4">
              {instructionsList.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-nbc-orange text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-nbc-brown leading-relaxed pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="pt-4 border-t border-nbc-tan">
            <p className="text-sm text-nbc-tan">
              Added on {new Date(recipe.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
