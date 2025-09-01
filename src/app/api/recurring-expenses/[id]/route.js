import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/recurring-expenses/[id]
 * Updates a recurring expense
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      description,
      amount,
      category,
      subCategory,
      frequency,
      startDate,
      endDate,
      isActive,
    } = body;

    const updatedRecurringExpense = await prisma.recurringExpense.update({
      where: { id },
      data: {
        description,
        amount: amount ? Number(amount) : undefined,
        category,
        subCategory,
        frequency,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive,
      },
    });

    return NextResponse.json({ recurringExpense: updatedRecurringExpense });
  } catch (error) {
    console.error('[RECURRING_EXPENSE_UPDATE]', error);
    if (error.code === 'P2025') {
      return new NextResponse('Recurring expense not found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * DELETE /api/recurring-expenses/[id]
 * Deletes a recurring expense
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.recurringExpense.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Recurring expense deleted successfully',
    });
  } catch (error) {
    console.error('[RECURRING_EXPENSE_DELETE]', error);
    if (error.code === 'P2025') {
      return new NextResponse('Recurring expense not found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
