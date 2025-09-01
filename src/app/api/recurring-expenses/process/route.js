import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

/**
 * POST /api/recurring-expenses/process
 * Processes all active recurring expenses for the current month
 * Creates expense entries if they don't already exist
 */
export async function POST(request) {
  try {
    const now = new Date();
    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();

    // Get the first day of the current month
    const monthStart = new Date(Date.UTC(currentYear, currentMonth, 1));
    // Get the first day of the next month
    const nextMonthStart = new Date(Date.UTC(currentYear, currentMonth + 1, 1));

    // Find all active recurring expenses
    const recurringExpenses = await prisma.recurringExpense.findMany({
      where: {
        isActive: true,
        OR: [{ endDate: null }, { endDate: { gte: monthStart } }],
        startDate: { lte: nextMonthStart },
      },
    });

    const processedExpenses = [];
    const skippedExpenses = [];

    for (const recurring of recurringExpenses) {
      try {
        // Check if this recurring expense has already been processed for this month
        const existingExpense = await prisma.expense.findFirst({
          where: {
            description: recurring.description,
            amount: recurring.amount,
            category: recurring.category,
            type: 'GASTO',
            date: {
              gte: monthStart,
              lt: nextMonthStart,
            },
          },
        });

        if (existingExpense) {
          skippedExpenses.push({
            id: recurring.id,
            description: recurring.description,
            reason: 'Already processed for this month',
          });
          continue;
        }

        // Create the expense entry
        const expense = await prisma.expense.create({
          data: {
            description: recurring.description,
            amount: recurring.amount,
            category: recurring.category,
            subCategory: recurring.subCategory,
            type: 'GASTO',
            date: monthStart, // Use the first day of the month
          },
        });

        // Update the lastProcessed date
        await prisma.recurringExpense.update({
          where: { id: recurring.id },
          data: { lastProcessed: now },
        });

        processedExpenses.push({
          id: recurring.id,
          description: recurring.description,
          expenseId: expense.id,
          amount: expense.amount,
        });
      } catch (error) {
        console.error(
          `Error processing recurring expense ${recurring.id}:`,
          error,
        );
        skippedExpenses.push({
          id: recurring.id,
          description: recurring.description,
          reason: `Error: ${error.message}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedExpenses.length,
      skipped: skippedExpenses.length,
      processedExpenses,
      skippedExpenses,
      message: `Processed ${processedExpenses.length} recurring expenses, skipped ${skippedExpenses.length}`,
    });
  } catch (error) {
    console.error('[RECURRING_EXPENSES_PROCESS]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
