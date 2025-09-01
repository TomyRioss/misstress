import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Obtener datos del mes actual
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    
    // Obtener datos del mes anterior
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const [currentMonthExpenses, lastMonthExpenses] = await Promise.all([
      prisma.expense.findMany({
        where: {
          date: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
    ]);

    // Calcular estadísticas del mes actual
    const currentIncome = currentMonthExpenses
      .filter(e => e.type === 'INGRESO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const currentExpenses = currentMonthExpenses
      .filter(e => e.type === 'GASTO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const currentBalance = currentIncome - currentExpenses;

    // Calcular estadísticas del mes anterior
    const lastIncome = lastMonthExpenses
      .filter(e => e.type === 'INGRESO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const lastExpenses = lastMonthExpenses
      .filter(e => e.type === 'GASTO')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    // Calcular tendencia mensual
    const monthlyTrend = lastExpenses > 0 
      ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 
      : 0;

    // Calcular tasa de ahorro
    const savingsRate = currentIncome > 0 
      ? (currentBalance / currentIncome) * 100 
      : 0;

    // Análisis por categorías
    const categoryAnalysis = currentMonthExpenses
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

    // Encontrar categoría principal
    const topCategory = Object.entries(categoryAnalysis)
      .map(([name, data]) => ({
        name,
        total: data.total,
        percentage: (data.total / currentExpenses) * 100,
      }))
      .sort((a, b) => b.total - a.total)[0];

    // Análisis por días de la semana
    const dayAnalysis = currentMonthExpenses
      .filter(e => e.type === 'GASTO')
      .reduce((acc, expense) => {
        const day = new Date(expense.date).toLocaleDateString('es', { weekday: 'long' });
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += parseFloat(expense.amount);
        return acc;
      }, {});

    const expensiveDay = Object.entries(dayAnalysis)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    // Predicciones simples basadas en tendencias
    const predictedExpenses = Math.round(currentExpenses * (1 + (monthlyTrend / 100)));
    const predictedSavings = Math.round(currentBalance * 1.05); // 5% de mejora
    const recommendedGoal = Math.round(currentExpenses * 0.8); // 20% menos que gastos actuales

    // Generar insights automáticos
    const insights = [];
    
    if (monthlyTrend > 10) {
      insights.push({
        type: 'warning',
        message: `Tus gastos han aumentado un ${monthlyTrend.toFixed(1)}% este mes`,
      });
    }

    if (savingsRate < 20) {
      insights.push({
        type: 'warning',
        message: `Tu tasa de ahorro es del ${savingsRate.toFixed(1)}%. Intenta ahorrar al menos el 20%`,
      });
    }

    if (topCategory && topCategory.percentage > 40) {
      insights.push({
        type: 'info',
        message: `${topCategory.name} representa el ${topCategory.percentage.toFixed(1)}% de tus gastos`,
      });
    }

    return NextResponse.json({
      currentMonth: {
        income: currentIncome,
        expenses: currentExpenses,
        balance: currentBalance,
      },
      monthlyTrend: monthlyTrend.toFixed(1),
      savingsRate: savingsRate.toFixed(1),
      topCategory,
      expensiveDay,
      predictedExpenses,
      predictedSavings,
      recommendedGoal,
      insights,
      categoryBreakdown: categoryAnalysis,
    });

  } catch (error) {
    console.error('Error generating smart analysis:', error);
    return NextResponse.json(
      { error: 'Error al generar el análisis inteligente' },
      { status: 500 }
    );
  }
}