import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USD_SALARY = 900;

// Devuelve el inicio (00:00) y el inicio del siguiente mes en UTC-3
function getMonthRange(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  // 00:00 en Buenos Aires (UTC-3) equivale a 03:00 UTC
  const monthStart = new Date(Date.UTC(year, month, 1, 3));
  const nextMonthStart = new Date(Date.UTC(year, month + 1, 1, 3));
  return { monthStart, nextMonthStart };
}

async function ensureSalaryForMonth(monthStart) {
  // ¿Existe ya un ingreso de salario para este mes?
  const existing = await prisma.expense.findFirst({
    where: {
      type: 'INGRESO',
      category: 'SALARIO',
      date: {
        gte: monthStart,
        lt: new Date(
          monthStart.getUTCFullYear(),
          monthStart.getUTCMonth() + 1,
          1,
        ),
      },
    },
  });
  if (existing) return;

  try {
    const res = await fetch('https://dolarapi.com/v1/dolares/blue');
    const json = await res.json();
    const venta = Number(json.venta);
    if (isNaN(venta)) return;
    const amountARS = USD_SALARY * venta;

    await prisma.expense.create({
      data: {
        description: 'Sueldo mensual',
        amount: amountARS,
        category: 'SALARIO',
        type: 'INGRESO',
        date: monthStart,
      },
    });
  } catch (err) {
    console.error('[ENSURE_SALARY]', err);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let monthStart, nextMonthStart;

    if (month && year) {
      const targetMonth = parseInt(month);
      const targetYear = parseInt(year);
      monthStart = new Date(Date.UTC(targetYear, targetMonth - 1, 1, 3));
      nextMonthStart = new Date(Date.UTC(targetYear, targetMonth, 1, 3));
    } else {
      const now = new Date();
      const { monthStart: ms, nextMonthStart: nms } = getMonthRange(now);
      monthStart = ms;
      nextMonthStart = nms;
    }

    await ensureSalaryForMonth(monthStart);

    const sums = await prisma.expense.groupBy({
      by: ['type'],
      where: {
        date: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
      _sum: {
        amount: true,
      },
    });

    let total_income = 0;
    let total_expense = 0;
    for (const s of sums) {
      if (s.type === 'INGRESO') total_income = Number(s._sum.amount || 0);
      if (s.type === 'GASTO') total_expense = Number(s._sum.amount || 0);
    }

    return NextResponse.json({
      totalIncome: total_income,
      totalExpenses: total_expense,
      balance: total_income - total_expense,
    });
  } catch (error) {
    console.error('[BALANCE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
