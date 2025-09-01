import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/recurring-expenses
 * Returns all active recurring expenses
 */
export async function GET() {
  try {
    const recurringExpenses = await prisma.recurringExpense.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ recurringExpenses });
  } catch (error) {
    console.error('[RECURRING_EXPENSES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST /api/recurring-expenses
 * Body: { description: string, amount: number, category?: string, subCategory?: string, frequency?: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      description,
      amount,
      category = 'OTROS',
      subCategory = null,
      frequency = 'MONTHLY',
      startDate,
      endDate,
    } = body;

    if (!description || !amount) {
      return new NextResponse('Description and amount are required', {
        status: 400,
      });
    }

    if (amount <= 0) {
      return new NextResponse('Amount must be greater than 0', {
        status: 400,
      });
    }

    const recurringExpense = await prisma.recurringExpense.create({
      data: {
        description,
        amount: Number(amount),
        category,
        subCategory,
        frequency,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ recurringExpense });
  } catch (error) {
    console.error('[RECURRING_EXPENSES_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
