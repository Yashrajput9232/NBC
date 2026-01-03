import { Clock, Users, ChefHat, Trash2 } from 'lucide-react';
import type { Recipe } from '../lib/supabase';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export default function RecipeCard({ recipe, onClick, onDelete }: RecipeCardProps) {
  const totalTime = recipe.prep_time + recipe.cook_time;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      onDelete(recipe.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-nbc-cream"
    >
      <div className="relative h-48 bg-gradient-to-br from-nbc-cream to-nbc-yellow overflow-hidden">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-20 h-20 text-nbc-tan" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-nbc-brown capitalize">
            {recipe.category}
          </span>
          <button
            onClick={handleDelete}
            className="p-2 bg-nbc-brown/90 backdrop-blur-sm rounded-full hover:bg-nbc-orange transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-nbc-brown mb-2 line-clamp-1 group-hover:text-nbc-orange transition-colors">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-nbc-tan text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-nbc-tan">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{totalTime} min</span>
            </div>
          )}
          {recipe.servings > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
