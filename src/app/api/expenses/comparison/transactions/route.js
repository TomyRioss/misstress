import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/expenses/comparison/transactions
 * Query params:
 * - currentMonth: number (1-12)
 * - currentYear: number
 * - compareMonth: number (1-12)
 * - compareYear: number
 * Returns all transactions from both months for side-by-side comparison.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentMonth =
      Number(searchParams.get('currentMonth')) || new Date().getUTCMonth() + 1;
    const currentYear =
      Number(searchParams.get('currentYear')) || new Date().getUTCFullYear();
    let compareMonth =
      Number(searchParams.get('compareMonth')) || currentMonth - 1;
    let compareYear = Number(searchParams.get('compareYear')) || currentYear;

    // Adjust for month 0 (December of previous year)
    if (compareMonth === 0) {
      compareMonth = 12;
      compareYear = currentYear - 1;
    }

    // Function to get transactions for a month
    const getMonthTransactions = async (year, month) => {
      const monthStart = new Date(Date.UTC(year, month - 1, 1));
      const nextMonthStart = new Date(Date.UTC(year, month, 1));

      const transactions = await prisma.expense.findMany({
        where: {
          type: 'GASTO',
          date: {
            gte: monthStart,
            lt: nextMonthStart,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        year,
        month,
        transactions: transactions.map(t => ({
          id: t.id,
          description: t.description || '',
          amount: Number(t.amount),
          date: t.date.toISOString().split('T')[0], // YYYY-MM-DD format
          category: t.category,
          subCategory: t.subCategory,
        })),
        total,
        count: transactions.length,
      };
    };

    // Fetch transactions for both months
    const [currentData, compareData] = await Promise.all([
      getMonthTransactions(currentYear, currentMonth),
      getMonthTransactions(compareYear, compareMonth),
    ]);

    const result = {
      current: currentData,
      previous: compareData,
      summary: {
        currentTotal: currentData.total,
        previousTotal: compareData.total,
        difference: currentData.total - compareData.total,
        percentageChange:
          compareData.total !== 0
            ? ((currentData.total - compareData.total) / compareData.total) *
              100
            : currentData.total > 0
            ? 100
            : 0,
        currentCount: currentData.count,
        previousCount: compareData.count,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[EXPENSES_COMPARISON_TRANSACTIONS]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
