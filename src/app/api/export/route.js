import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, format, dateRange } = body;

    // Obtener datos según el tipo de reporte
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
      orderBy: { date: 'desc' },
    });

    const goals = await prisma.financialGoal.findMany({
      where: { status: 'ACTIVE' },
    });

    // Calcular estadísticas
    const totalIncome = expenses
      .filter(e => e.type === 'INGRESO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const totalExpenses = expenses
      .filter(e => e.type === 'GASTO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const balance = totalIncome - totalExpenses;

    // Agrupar por categorías
    const categoryStats = expenses
      .filter(e => e.type === 'GASTO')
      .reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += parseFloat(expense.amount);
        acc[category].count += 1;
        return acc;
      }, {});

    const reportData = {
      type,
      dateRange,
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        transactionCount: expenses.length,
      },
      categoryStats,
      expenses: expenses.map(e => ({
        ...e,
        amount: parseFloat(e.amount),
      })),
      goals: goals.map(g => ({
        ...g,
        targetAmount: parseFloat(g.targetAmount),
        currentAmount: parseFloat(g.currentAmount),
      })),
    };

    if (format === 'json') {
      return NextResponse.json(reportData);
    }

    // Para PDF y Excel, por ahora devolvemos JSON
    // En una implementación real, usarías librerías como jsPDF o ExcelJS
    const response = NextResponse.json(reportData);
    response.headers.set('Content-Disposition', `attachment; filename="reporte_${type}_${new Date().toISOString().split('T')[0]}.${format}"`);
    return response;

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Error al generar el reporte' },
      { status: 500 }
    );
  }
}