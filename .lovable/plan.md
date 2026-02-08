
# OEMB Studio - Sistema de Análisis y Creación de Contenido Viral

## Visión General
Una app personal tipo "estudio de producción" con chat IA integrado que usa tus 8 prompts XML como cerebro. Interfaz conversacional donde hablas con la IA y ella orquesta automáticamente el prompt correcto según lo que necesites, o puedes seleccionar manualmente el módulo.

---

## Página 1: Dashboard Principal
- Vista general de tus proyectos recientes
- Acceso rápido a crear nuevo proyecto o continuar uno existente
- Estadísticas básicas: proyectos activos, guiones generados, títulos creados

## Página 2: Chat Studio (Corazón de la App)
- **Chat conversacional con IA** que detecta automáticamente qué módulo usar (como tu OEMB Studio Map orquestador)
- **Selector de módulos** en la barra lateral para forzar un módulo específico:
  - 🎬 **Guiones** - Generación de narrativas con el motor de storytelling
  - 💡 **Conceptos** (Prompt 1) - Generador de núcleo conceptual
  - 🖼️ **Thumbnails** (Prompts 2, 3, 4) - Compilador visual, análisis forense y tipografía
  - ✍️ **Copy Vault** (Prompt 5) - Banco de títulos y copys automotrices
  - 🎯 **Black Box** (Prompt 6) - Generador de títulos outlier virales
  - 📊 **Analítica** (Prompt 7) - Análisis forense post-publicación
  - 🔍 **SEO** (Prompt 8) - Arquitecto de descripciones y tags
- Los outputs de la IA se renderizan con formato rico (markdown, tablas, JSON visual)
- Botón para guardar cualquier output como parte del proyecto actual

## Página 3: Proyectos
- Lista de todos tus proyectos guardados (cada video = un proyecto)
- Dentro de cada proyecto: historial de conversaciones, guiones generados, títulos, conceptos de thumbnail, SEO
- Posibilidad de exportar el contenido de un proyecto

## Backend
- **Lovable Cloud** con base de datos para almacenar proyectos y outputs
- **Edge function** conectada a Lovable AI para procesar las conversaciones usando tus prompts XML como sistema
- Los prompts XML se almacenan como instrucciones de sistema en el backend, el usuario solo conversa naturalmente
- Historial de chat persistente por proyecto

## Diseño
- Tema oscuro por defecto (estilo studio/producción)
- Interfaz limpia inspirada en herramientas de producción profesional
- Colores accent en rojo/naranja (vibrante, automotriz)
