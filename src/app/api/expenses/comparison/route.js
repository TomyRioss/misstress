import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/expenses/comparison
 * Query params:
 * - currentMonth: number (1-12)
 * - currentYear: number
 * - compareMonth: number (1-12)
 * - compareYear: number
 * Returns comparison data between two months including differences, percentages, and trends.
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
    let compareYear =
      Number(searchParams.get('compareYear')) ||
      (compareMonth === 0 ? currentYear - 1 : currentYear);

    // Adjust for month 0 (December of previous year)
    if (compareMonth === 0) {
      compareMonth = 12;
      compareYear = currentYear - 1;
    }

    // Function to get month data
    const getMonthData = async (year, month) => {
      const monthStart = new Date(Date.UTC(year, month - 1, 1));
      const nextMonthStart = new Date(Date.UTC(year, month, 1));

      const grouped = await prisma.expense.groupBy({
        by: ['category'],
        where: {
          type: 'GASTO',
          date: {
            gte: monthStart,
            lt: nextMonthStart,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const total = grouped.reduce(
        (sum, g) => sum + Number(g._sum.amount || 0),
        0,
      );

      return {
        year,
        month,
        categories: grouped.map(g => ({
          category: g.category,
          amount: Number(g._sum.amount || 0),
        })),
        total,
      };
    };

    // Fetch data for both months
    const [currentData, compareData] = await Promise.all([
      getMonthData(currentYear, currentMonth),
      getMonthData(compareYear, compareMonth),
    ]);

    // Create comparison map
    const comparisonMap = new Map();

    // Add current month categories
    currentData.categories.forEach(cat => {
      comparisonMap.set(cat.category, {
        category: cat.category,
        current: cat.amount,
        previous: 0,
      });
    });

    // Add/compare previous month categories
    compareData.categories.forEach(cat => {
      if (comparisonMap.has(cat.category)) {
        comparisonMap.get(cat.category).previous = cat.amount;
      } else {
        comparisonMap.set(cat.category, {
          category: cat.category,
          current: 0,
          previous: cat.amount,
        });
      }
    });

    // Calculate differences and percentages
    const comparisons = Array.from(comparisonMap.values()).map(item => {
      const difference = item.current - item.previous;
      const percentageChange =
        item.previous !== 0
          ? (difference / item.previous) * 100
          : item.current > 0
          ? 100
          : 0;
      const trend =
        difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'stable';

      return {
        category: item.category,
        current: item.current,
        previous: item.previous,
        difference: Math.abs(difference),
        percentageChange: Math.abs(percentageChange),
        trend,
        isIncrease: difference > 0,
      };
    });

    // Sort by current amount descending
    comparisons.sort((a, b) => b.current - a.current);

    // Calculate totals
    const totalCurrent = currentData.total;
    const totalPrevious = compareData.total;
    const totalDifference = totalCurrent - totalPrevious;
    const totalPercentageChange =
      totalPrevious !== 0
        ? (totalDifference / totalPrevious) * 100
        : totalCurrent > 0
        ? 100
        : 0;

    const result = {
      current: {
        year: currentYear,
        month: currentMonth,
        total: totalCurrent,
      },
      previous: {
        year: compareYear,
        month: compareMonth,
        total: totalPrevious,
      },
      totals: {
        difference: Math.abs(totalDifference),
        percentageChange: Math.abs(totalPercentageChange),
        trend:
          totalDifference > 0
            ? 'increase'
            : totalDifference < 0
            ? 'decrease'
            : 'stable',
        isIncrease: totalDifference > 0,
      },
      categories: comparisons,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[EXPENSES_COMPARISON]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
