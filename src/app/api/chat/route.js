import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// Bot de respaldo local para cuando N8N no esté disponible
function getLocalBotResponse(message) {
  const msg = message.toLowerCase();

  // Respuestas relacionadas con finanzas personales
  if (
    msg.includes('hola') ||
    msg.includes('hi') ||
    msg.includes('buenos') ||
    msg.includes('buenas')
  ) {
    return '## ¡Hola! 😊\n\n**Soy tu asistente financiero personal** con soporte completo de Markdown.\n\n### ¿En qué puedo ayudarte hoy?\n\n✅ **Gestión de gastos** - Agregar, editar, analizar\n✅ **Presupuesto** - Control y planificación\n✅ **Categorías** - Organización inteligente\n✅ **Consultas** - Cualquier duda sobre finanzas\n\n> 💡 **Tip**: Escribe `ejemplo markdown` para ver todas las opciones de formato\n\n¿Qué te gustaría hacer primero? ✨';
  }

  if (
    msg.includes('gasto') ||
    msg.includes('dinero') ||
    msg.includes('presupuesto')
  ) {
    return '📊 **Gestión de Gastos**\n\nVeo que quieres hablar sobre gastos. Aquí tienes las opciones disponibles:\n\n### 🎯 Acciones Rápidas\n- **Dashboard** → Vista general con gráficos\n- **Agregar Gasto** → Botón `+` en la esquina superior\n- **Hoja de Cálculo** → Vista detallada día por día\n- **Historial** → Progreso mensual con tendencias\n\n### 📋 Análisis Disponibles\n1. **Por categoría** - ¿Dónde gastas más?\n2. **Por mes** - Comparativa temporal\n3. **Balance** - Ingresos vs Gastos\n\n> 💡 **Tip**: Usa el toggle `📊 Resumen` / `📋 Detalle` en el dashboard\n\n¿En qué aspecto específico te gustaría que te ayude?';
  }

  if (msg.includes('categoria') || msg.includes('categoría')) {
    return '🏷️ **Categorías de Gastos e Ingresos**\n\n### 💸 Categorías de Gastos\n| Icono | Categoría | Ejemplos |\n|-------|-----------|----------|\n| 🍔 | **Comida** | Restaurantes, supermercado, delivery |\n| 🏠 | **Alquiler** | Renta, expensas, seguro |\n| 🚗 | **Transporte** | Combustible, taxi, transporte público |\n| 🎬 | **Entretenimiento** | Cine, streaming, salidas |\n| 💡 | **Servicios** | Luz, gas, agua, internet |\n| 🏥 | **Salud** | Medicinas, consultas, obra social |\n| 📚 | **Educación** | Cursos, libros, materiales |\n| ⚽ | **Deportes** | Gimnasio, equipamiento, clases |\n| 📦 | **Otros** | Gastos varios |\n\n### 💰 Categorías de Ingresos\n- **💰 Salario** - Sueldo principal, freelance, bonos\n\n> 📊 **Consejo**: Usa categorías específicas para análisis más precisos\n\n¿Quieres saber cómo cambiar la categoría de un gasto?';
  }

  if (
    msg.includes('salario') ||
    msg.includes('ingreso') ||
    msg.includes('sueldo')
  ) {
    return '💰 Para configurar tu salario, ve a la sección "Configuración" en el menú lateral. Allí puedes:\n\n• Establecer tu salario mensual\n• Modificarlo cuando sea necesario\n• Ver el cálculo automático en ARS\n\n¡Tu salario se agrega automáticamente cada mes!';
  }

  if (
    msg.includes('reporte') ||
    msg.includes('historial') ||
    msg.includes('progreso')
  ) {
    return '📈 Para revisar tu progreso financiero:\n\n• **Dashboard**: Vista general del mes actual\n• **Hoja de Cálculo**: Detalles día por día\n• **Historial Mensual**: Progreso a lo largo del tiempo\n• **Transacciones**: Gestión completa de registros\n\n¿Qué tipo de análisis te interesa?';
  }

  if (
    msg.includes('help') ||
    msg.includes('ayuda') ||
    msg.includes('como') ||
    msg.includes('cómo')
  ) {
    return '🤔 ¡Estoy aquí para ayudarte! Estas son las funciones principales:\n\n• **Agregar gastos**: Usa el botón "+" en el dashboard\n• **Ver resumen**: Dashboard con gráficos y estadísticas\n• **Analizar datos**: Hoja de cálculo detallada\n• **Historial**: Progreso mensual con gráficos\n• **Configurar**: Establecer salario y preferencias\n\n¿Hay algo específico que quieras aprender?';
  }

  if (msg.includes('gracias') || msg.includes('thanks')) {
    return '¡De nada! 😊 Estoy aquí siempre que necesites ayuda con tus finanzas. ¡Que tengas un excelente día gestionando tu dinero! 💪✨';
  }

  // Respuesta con Markdown para mostrar ejemplo
  if (
    msg.includes('markdown') ||
    msg.includes('formato') ||
    msg.includes('ejemplo')
  ) {
    return '📝 ¡Puedo responder en **Markdown**! Aquí tienes algunos ejemplos:\n\n## Formatos Disponibles\n\n• **Texto en negrita**\n• *Texto en cursiva*\n• `código inline`\n• [Enlaces](https://ejemplo.com)\n\n### Lista de Tareas\n1. ✅ **Agregar gastos** - Completo\n2. 🔄 **Revisar presupuesto** - En proceso\n3. ⭐ **Configurar metas** - Pendiente\n\n```javascript\n// Ejemplo de código\nconst balance = ingresos - gastos;\nconsole.log(`Tu balance: $${balance}`);\n```\n\n> **Tip**: Usa el dashboard para ver tu progreso financiero\n\n¿Te gustaría ver más ejemplos?';
  }

  // Respuesta general
  return `🤖 Hola! Soy tu asistente financiero personal. Puedo ayudarte con:\n\n• Gestión de gastos e ingresos\n• Análisis de tu presupuesto\n• Configuración de categorías\n• Consejos sobre finanzas personales\n\n¿En qué te puedo ayudar específicamente? También puedes preguntarme sobre cómo usar las diferentes funciones de la aplicación. 💡`;
}

/**
 * POST /api/chat
 * Sends the user's message to the N8N webhook and streams back the AI response.
 */
export async function POST(request) {
  // Si no hay webhook configurado, usar el bot local
  if (!WEBHOOK_URL) {
    try {
      const { message } = await request.json();
      if (!message || typeof message !== 'string') {
        return new NextResponse('Missing "message" field', { status: 400 });
      }

      const reply = getLocalBotResponse(message);
      return NextResponse.json({ reply });
    } catch (error) {
      console.error('[LOCAL_CHAT]', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return new NextResponse('Missing "message" field', { status: 400 });
    }

    // Forward the message to the N8N webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    // Obtener la respuesta como texto primero
    const responseText = await webhookResponse.text();

    if (!webhookResponse.ok) {
      // Si el webhook falla, usar el bot local de respaldo
      console.log('[CHAT] Webhook no disponible, usando bot local de respaldo');
      const localReply = getLocalBotResponse(message);
      return NextResponse.json({
        reply: `${localReply}\n\n_💡 Modo local activo - El asistente avanzado no está disponible momentáneamente._`,
        fallback: true,
      });
    }

    // Intentar parsear como JSON, si falla, usar el texto directamente
    let botReply;
    try {
      const jsonData = JSON.parse(responseText);
      // Manejar diferentes formatos de respuesta del webhook
      if (jsonData.output) {
        botReply = jsonData.output;
      } else if (jsonData.reply) {
        botReply = jsonData.reply;
      } else if (jsonData.message) {
        botReply = jsonData.message;
      } else if (typeof jsonData === 'string') {
        botReply = jsonData;
      } else {
        // Si es un objeto complejo, convertir a string
        botReply = JSON.stringify(jsonData);
      }
    } catch (e) {
      // Si no es JSON válido, usar el texto directamente como respuesta del bot
      botReply = responseText;
    }

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error('[CHAT_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
