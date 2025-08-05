import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/expenses/summary?year=YYYY&month=M (1-12)
 * Devuelve el total por categoría para el mes indicado.
 * Si no se envían parámetros, usa el mes y año actuales (UTC).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year =
      Number(searchParams.get('year')) || new Date().getUTCFullYear();
    const month =
      Number(searchParams.get('month')) || new Date().getUTCMonth() + 1; // 1-based

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

    const summary = grouped.map(g => ({
      category: g.category,
      total: Number(g._sum.amount || 0),
    }));

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('[EXPENSES_SUMMARY]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
