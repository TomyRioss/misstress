import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const goals = await prisma.financialGoal.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Error al obtener las metas' },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, targetAmount, targetDate, color, icon } = body;

    if (!name || !targetAmount) {
      return NextResponse.json(
        { error: 'Nombre y monto objetivo son requeridos' },
        { status: 400 },
      );
    }

    const goal = await prisma.financialGoal.create({
      data: {
        name,
        description,
        targetAmount: parseFloat(targetAmount),
        targetDate: targetDate ? new Date(targetDate) : null,
        color: color || '#3B82F6',
        icon: icon || '🎯',
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Error al crear la meta' },
      { status: 500 },
    );
  }
}
