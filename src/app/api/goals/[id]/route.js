import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      targetAmount,
      currentAmount,
      targetDate,
      status,
      color,
      icon,
    } = body;

    const goal = await prisma.financialGoal.update({
      where: { id },
      data: {
        name,
        description,
        targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
        currentAmount: currentAmount ? parseFloat(currentAmount) : undefined,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        status,
        color,
        icon,
      },
    });

    return NextResponse.json({ goal });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la meta' },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.financialGoal.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Meta eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la meta' },
      { status: 500 },
    );
  }
}
