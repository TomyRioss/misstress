import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET single expense
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 },
      );
    }

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

// PUT update expense
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, amount, category, subCategory, type, date } = body;

    // Validations
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 },
      );
    }

    if (!['INGRESO', 'GASTO'].includes(type)) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        description: description || null,
        amount,
        category,
        subCategory: subCategory || null,
        type,
        date: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json({
      expense: updatedExpense,
      message: 'Transacción actualizada correctamente',
    });
  } catch (error) {
    console.error('Error updating expense:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

// DELETE expense
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Transacción eliminada correctamente',
    });
  } catch (error) {
    console.error('Error deleting expense:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
