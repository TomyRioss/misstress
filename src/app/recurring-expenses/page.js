import RecurringExpenses from '../../components/RecurringExpenses';

export default function RecurringExpensesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecurringExpenses />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Gastos Recurrentes - Mistress App',
  description: 'Gestiona tus gastos que se repiten mensualmente',
};
