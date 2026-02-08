export type ModuleId = 'orchestrator' | 'guiones' | 'conceptos' | 'thumbnails' | 'copy_vault' | 'black_box' | 'analitica' | 'seo';

export interface Module {
  id: ModuleId;
  name: string;
  icon: string;
  description: string;
  shortDescription: string;
}

export const MODULES: Module[] = [
  {
    id: 'orchestrator',
    name: 'OEMB Studio',
    icon: '🧠',
    description: 'Orquestador inteligente que detecta automáticamente qué módulo usar según tu mensaje',
    shortDescription: 'Auto-detecta el módulo'
  },
  {
    id: 'guiones',
    name: 'Guiones',
    icon: '🎬',
    description: 'Genetic Storytelling Engine - Generación de narrativas automotrices con alma técnica',
    shortDescription: 'Narrativas y storytelling'
  },
  {
    id: 'conceptos',
    name: 'Conceptos',
    icon: '💡',
    description: 'Generador de Núcleo Conceptual - ADN estratégico, emocional y técnico',
    shortDescription: 'Núcleo conceptual'
  },
  {
    id: 'thumbnails',
    name: 'Thumbnails',
    icon: '🖼️',
    description: 'Compilador visual + Análisis forense pixel-perfect + Forensis tipográfica',
    shortDescription: 'Visual y análisis'
  },
  {
    id: 'copy_vault',
    name: 'Copy Vault',
    icon: '✍️',
    description: 'Banco de 10,000+ títulos y copys automotrices con patrones virales probados',
    shortDescription: 'Banco de títulos'
  },
  {
    id: 'black_box',
    name: 'Black Box',
    icon: '🎯',
    description: 'Generador de títulos outlier (15x+ promedio) con triggers psicológicos',
    shortDescription: 'Títulos outlier virales'
  },
  {
    id: 'analitica',
    name: 'Analítica',
    icon: '📊',
    description: 'Motor forense post-publicación - Secuenciador genético de patrones virales',
    shortDescription: 'Análisis post-publicación'
  },
  {
    id: 'seo',
    name: 'SEO',
    icon: '🔍',
    description: 'Arquitecto de descripciones, tags y timestamps para máximo tráfico orgánico',
    shortDescription: 'SEO y descripciones'
  }
];

export const getModule = (id: ModuleId) => MODULES.find(m => m.id === id)!;
