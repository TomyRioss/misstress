import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/expenses/monthly
 * Query params: year
 * Devuelve los totales por mes y tipo (INGRESO / GASTO) del año especificado o actual.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam) : new Date().getUTCFullYear();

    const startYear = new Date(Date.UTC(year, 0, 1));
    const startNextYear = new Date(Date.UTC(year + 1, 0, 1));

    // Consulta SQL para obtener totales por mes
    const results = await prisma.$queryRaw`
      SELECT EXTRACT(MONTH FROM "date") AS month,
             SUM(CASE WHEN type = 'GASTO' THEN amount ELSE 0 END) AS total_expense,
             SUM(CASE WHEN type = 'INGRESO' THEN amount ELSE 0 END) AS total_income
      FROM "Expense"
      WHERE "date" >= ${startYear} AND "date" < ${startNextYear}
      GROUP BY month
      ORDER BY month;
    `;

    return NextResponse.json({ months: results });
  } catch (error) {
    console.error('[MONTHLY_SUMMARY]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
