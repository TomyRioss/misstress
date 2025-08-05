import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/expenses
 * Returns the list of expenses for the current month ordered by most recent.
 */
export async function GET() {
  try {
    const now = new Date();
    // Beginning of current month (00:00:00 on the 1st)
    const monthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    // Beginning of next month
    const nextMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    const expenses = await prisma.expense.findMany({
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

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('[EXPENSES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST /api/expenses
 * Body: { description?: string, amount: number, category?: string, date?: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      description = '',
      amount,
      category = 'OTROS',
      subCategory = null,
      date,
      type = 'GASTO',
    } = body;

    if (amount === undefined || isNaN(Number(amount))) {
      return new NextResponse('"amount" es requerido y debe ser numérico', {
        status: 400,
      });
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: Number(amount),
        category,
        subCategory,
        type,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('[EXPENSES_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
