import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { dateRange } = body;

    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999);

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalIncome = expenses
      .filter(e => e.type === 'INGRESO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const totalExpenses = expenses
      .filter(e => e.type === 'GASTO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const balance = totalIncome - totalExpenses;

    // Calcular insights rápidos
    const dailyAverage = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const topCategory = expenses
      .filter(e => e.type === 'GASTO')
      .reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(expense.amount);
        return acc;
      }, {});

    const topCategoryName = Object.keys(topCategory).reduce((a, b) => 
      topCategory[a] > topCategory[b] ? a : b, Object.keys(topCategory)[0]
    );

    return NextResponse.json({
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      balance: balance.toFixed(2),
      transactionCount: expenses.length,
      dailyAverage: dailyAverage.toFixed(2),
      topCategory: topCategoryName,
      topCategoryAmount: topCategory[topCategoryName]?.toFixed(2) || '0.00',
    });

  } catch (error) {
    console.error('Error generating quick report:', error);
    return NextResponse.json(
      { error: 'Error al generar el reporte rápido' },
      { status: 500 }
    );
  }
}