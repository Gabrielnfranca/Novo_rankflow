
export type RoadmapStep = {
  id: string
  title: string
  description?: string
  tasks: {
    id: string
    label: string
    description?: string
  }[]
}

export const ROADMAP_DATA: RoadmapStep[] = [
  {
    id: "setup",
    title: "1. Setup & Onboarding",
    description: "Configurações iniciais essenciais para qualquer projeto de SEO.",
    tasks: [
      { id: "setup_ga4", label: "Configurar Google Analytics 4", description: "Instalar tag e configurar eventos básicos." },
      { id: "setup_gsc", label: "Configurar Google Search Console", description: "Verificar propriedade e enviar sitemap." },
      { id: "setup_access", label: "Solicitar acessos (WordPress, CMS)", description: "Garantir acesso administrativo." },
      { id: "setup_gmb", label: "Configurar Google Meu Negócio", description: "Reivindicar e otimizar ficha." },
    ]
  },
  {
    id: "technical",
    title: "2. SEO Técnico (Auditoria)",
    description: "Correções estruturais e de performance no site.",
    tasks: [
      { id: "tech_sitemap", label: "Verificar e enviar Sitemap.xml", description: "Garantir que todas as páginas importantes estão listadas." },
      { id: "tech_robots", label: "Configurar Robots.txt", description: "Bloquear áreas administrativas e permitir crawlers." },
      { id: "tech_cwv", label: "Análise de Core Web Vitals", description: "Testar velocidade e experiência de página (LCP, CLS, INP)." },
      { id: "tech_404", label: "Correção de erros 404", description: "Identificar links quebrados e criar redirecionamentos." },
      { id: "tech_ssl", label: "Verificar Certificado SSL (HTTPS)", description: "Garantir segurança do site." },
      { id: "tech_canonical", label: "Verificar Tags Canônicas", description: "Evitar conteúdo duplicado." },
    ]
  },
  {
    id: "keywords",
    title: "3. Pesquisa de Palavras-chave",
    description: "Definição da estratégia de conteúdo.",
    tasks: [
      { id: "kw_research", label: "Pesquisa de Palavras-chave (Seed)", description: "Identificar termos principais do nicho." },
      { id: "kw_competitors", label: "Análise de Concorrência", description: "Verificar termos que concorrentes ranqueiam." },
      { id: "kw_mapping", label: "Mapeamento de Palavras-chave", description: "Definir qual página ataca qual palavra-chave." },
    ]
  },
  {
    id: "onpage",
    title: "4. Otimização On-Page",
    description: "Melhorias diretas no conteúdo e estrutura das páginas.",
    tasks: [
      { id: "onpage_titles", label: "Otimizar Title Tags e Meta Descriptions", description: "Focar em CTR e palavra-chave principal." },
      { id: "onpage_h1", label: "Revisar Estrutura de Headings (H1, H2, H3)", description: "Hierarquia lógica de conteúdo." },
      { id: "onpage_images", label: "Otimizar Imagens (Alt Text + Peso)", description: "Compressão e descrição para acessibilidade." },
      { id: "onpage_internal", label: "Linkagem Interna", description: "Conectar páginas relevantes entre si." },
    ]
  },
  {
    id: "content",
    title: "5. Marketing de Conteúdo",
    description: "Criação de autoridade através de blog e materiais ricos.",
    tasks: [
      { id: "content_calendar", label: "Criar Calendário Editorial", description: "Planejamento de pautas mensais." },
      { id: "content_briefing", label: "Produção de Briefings", description: "Diretrizes para redatores." },
      { id: "content_publish", label: "Publicação e Otimização", description: "Postagem com formatação adequada." },
    ]
  },
  {
    id: "offpage",
    title: "6. Off-Page & Link Building",
    description: "Aumento de autoridade do domínio.",
    tasks: [
      { id: "offpage_audit", label: "Auditoria de Backlinks Tóxicos", description: "Disavow de links spam." },
      { id: "offpage_prospect", label: "Prospecção de Guest Posts", description: "Encontrar parceiros relevantes." },
      { id: "offpage_local", label: "Citações Locais", description: "Cadastrar em diretórios locais." },
    ]
  }
]
