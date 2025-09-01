'use client';

const CATEGORY_LABELS = {
  COMIDA: 'Comida',
  ALQUILER: 'Alquiler',
  TRANSPORTE: 'Transporte',
  ENTRETENIMIENTO: 'Entretenimiento',
  SERVICIOS: 'Servicios',
  SALUD: 'Salud',
  EDUCACION: 'Educación',
  DEPORTES: 'Deportes',
  SALARIO: 'Salario',
  OTROS: 'Otros',
};

export default function ComparisonFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  onSelectAll,
  onClearAll,
}) {
  const handleCategoryToggle = category => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const isAllSelected = categories.length === selectedCategories.length;
  const isNoneSelected = selectedCategories.length === 0;

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filtrar Categorías
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={isAllSelected}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Seleccionar Todo
          </button>
          <button
            onClick={onClearAll}
            disabled={isNoneSelected}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Limpiar Todo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category);
          return (
            <label
              key={category}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-neutral-600 hover:border-gray-300 dark:hover:border-neutral-500'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCategoryToggle(category)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span
                className={`text-sm font-medium ${
                  isSelected
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {CATEGORY_LABELS[category] || category}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {selectedCategories.length} de {categories.length} categorías
        seleccionadas
      </div>
    </div>
  );
}
