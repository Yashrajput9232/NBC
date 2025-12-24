import { useState, useEffect } from 'react';
import { Plus, BookOpen, Search } from 'lucide-react';
import { supabase, type Recipe } from './lib/supabase';
import RecipeForm, { type RecipeFormData } from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = async (formData: RecipeFormData) => {
    try {
      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(formData)
          .eq('id', editingRecipe.id);

        if (error) throw error;
        setEditingRecipe(null);
      } else {
        const { error } = await supabase.from('recipes').insert([formData]);

        if (error) throw error;
      }
      await fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id);

      if (error) throw error;
      await fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || recipe.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'appetizer', 'snack', 'drink', 'other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">NBC Ka Khana</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} in your collection
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingRecipe(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Recipe
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filterCategory === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterCategory !== 'all' ? 'No recipes found' : 'No recipes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start building your recipe collection by adding your first recipe'}
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <button
                onClick={() => {
                  setEditingRecipe(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Your First Recipe
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <RecipeForm
          onSubmit={handleAddRecipe}
          onClose={() => {
            setShowForm(false);
            setEditingRecipe(null);
          }}
          initialRecipe={editingRecipe ? {
            title: editingRecipe.title,
            description: editingRecipe.description,
            ingredients: editingRecipe.ingredients,
            instructions: editingRecipe.instructions,
            prep_time: editingRecipe.prep_time || '',
            cook_time: editingRecipe.cook_time || '',
            servings: editingRecipe.servings,
            category: editingRecipe.category,
            image_url: editingRecipe.image_url,
            source_link: editingRecipe.source_link,
            id: editingRecipe.id,
          } : undefined}
          isEditing={!!editingRecipe}
        />
      )}

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={(recipe) => {
            setSelectedRecipe(null);
            setEditingRecipe(recipe);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
