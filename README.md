# 💰 Gestor de Gastos Inteligente

Una aplicación web moderna para el control de finanzas personales con funcionalidades avanzadas de análisis y gestión.

## 🚀 Funcionalidades Principales

### 📊 Dashboard Inteligente
- **Vista general** con estadísticas en tiempo real
- **Gráficos interactivos** de gastos por categorías
- **Análisis de tendencias** mensuales y anuales
- **Modo oscuro/claro** con detección automática del sistema

### 🎯 Sistema de Metas Financieras
- **Crear y gestionar metas** de ahorro personalizadas
- **Seguimiento de progreso** con barras visuales
- **Fechas objetivo** con alertas de vencimiento
- **Iconos y colores** personalizables para cada meta
- **Actualización rápida** del progreso

### 🤖 Análisis Inteligente
- **Insights automáticos** basados en patrones de gasto
- **Recomendaciones personalizadas** para optimizar finanzas
- **Predicciones** de gastos futuros
- **Análisis de tendencias** con alertas inteligentes
- **Detección de días más costosos** de la semana

### 🔔 Notificaciones Inteligentes
- **Alertas automáticas** de gastos excesivos
- **Recordatorios** de metas financieras
- **Insights diarios** con estadísticas relevantes
- **Sistema de notificaciones** no leídas
- **Categorización** por tipo de alerta

### 📊 Exportación de Reportes
- **Reportes en PDF** y Excel
- **Múltiples formatos**: mensual, trimestral, anual
- **Rangos de fechas** personalizables
- **Reporte rápido** con resumen ejecutivo
- **Descarga automática** de archivos

### 💳 Gestión de Transacciones
- **Agregar gastos e ingresos** de forma rápida
- **Categorización automática** con iconos
- **Búsqueda y filtros** avanzados
- **Vista de hoja de cálculo** detallada
- **Historial mensual** con comparativas

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Gráficos**: Chart.js, React-Chartjs-2
- **Notificaciones**: Sonner
- **Iconos**: Emojis nativos para mejor rendimiento

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd mistress_app
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Configurar base de datos**
```bash
# Crear archivo .env con las variables de entorno
DATABASE_URL="postgresql://user:password@localhost:5432/mistress_app"
DIRECT_URL="postgresql://user:password@localhost:5432/mistress_app"
```

4. **Generar cliente de Prisma**
```bash
npx prisma generate
```

5. **Ejecutar migraciones**
```bash
npx prisma migrate dev
```

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

7. **Abrir en el navegador**
```
http://localhost:3000
```

## 📱 Características Avanzadas

### 🎨 Interfaz Moderna
- **Diseño responsive** para móviles y desktop
- **Modo oscuro/claro** con transiciones suaves
- **Animaciones fluidas** y micro-interacciones
- **Iconografía consistente** con emojis

### 🔒 Seguridad
- **Validación de datos** en frontend y backend
- **Sanitización** de inputs
- **Manejo de errores** robusto
- **Logs de auditoría** para transacciones

### ⚡ Rendimiento
- **Optimización de imágenes** automática
- **Lazy loading** de componentes
- **Caché inteligente** de datos
- **Bundle splitting** optimizado

## 🎯 Roadmap

- [ ] **Integración con bancos** para importación automática
- [ ] **Análisis de gastos recurrentes** con IA
- [ ] **Sistema de presupuestos** por categoría
- [ ] **Alertas de límites** de gasto
- [ ] **Exportación a Google Sheets**
- [ ] **App móvil** nativa
- [ ] **Sincronización en la nube**
- [ ] **Múltiples monedas**

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor:
- Abre un issue en GitHub
- Revisa la documentación
- Contacta al equipo de desarrollo

---

**¡Disfruta gestionando tus finanzas de forma inteligente! 💰✨**
