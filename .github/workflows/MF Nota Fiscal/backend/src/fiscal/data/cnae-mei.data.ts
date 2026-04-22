/**
 * CNAEs permitidos para MEI — Resolução CGSN nº 182/2023.
 * Cada entrada indica o código, descrição e o tipo de nota que gera.
 * 'NFE'  = comércio/indústria → NF-e
 * 'NFSE' = serviços → NFS-e
 * 'BOTH' = atividades mistas permitidas ao MEI (emite os dois tipos)
 */
export interface CnaeMei {
  code: string;
  description: string;
  invoiceType: 'NFE' | 'NFSE' | 'BOTH';
}

export const CNAES_MEI: CnaeMei[] = [
  // ── Comércio ──────────────────────────────────────────────
  { code: '4711-3/02', description: 'Comércio varejista de mercadorias em geral', invoiceType: 'NFE' },
  { code: '4712-1/00', description: 'Comércio varejista de mercadorias em geral (lojas de conveniência)', invoiceType: 'NFE' },
  { code: '4721-1/02', description: 'Padaria e confeitaria com predominância de revenda', invoiceType: 'NFE' },
  { code: '4722-9/01', description: 'Comércio varejista de carnes', invoiceType: 'NFE' },
  { code: '4723-7/00', description: 'Comércio varejista de bebidas', invoiceType: 'NFE' },
  { code: '4731-8/00', description: 'Comércio varejista de combustíveis', invoiceType: 'NFE' },
  { code: '4741-5/00', description: 'Comércio varejista de tintas e materiais para pintura', invoiceType: 'NFE' },
  { code: '4742-3/00', description: 'Comércio varejista de material elétrico', invoiceType: 'NFE' },
  { code: '4743-1/00', description: 'Comércio varejista de vidros', invoiceType: 'NFE' },
  { code: '4744-0/01', description: 'Comércio varejista de ferragens e ferramentas', invoiceType: 'NFE' },
  { code: '4744-0/02', description: 'Comércio varejista de madeira e artefatos', invoiceType: 'NFE' },
  { code: '4744-0/04', description: 'Comércio varejista de cal, areia e pedra britada', invoiceType: 'NFE' },
  { code: '4744-0/05', description: 'Comércio varejista de materiais de construção não especificados', invoiceType: 'NFE' },
  { code: '4751-2/01', description: 'Comércio varejista de equipamentos de informática', invoiceType: 'NFE' },
  { code: '4751-2/02', description: 'Recarga de cartuchos para equipamentos de informática', invoiceType: 'BOTH' },
  { code: '4752-1/00', description: 'Comércio varejista de aparelhos eletrodomésticos', invoiceType: 'NFE' },
  { code: '4753-9/00', description: 'Comércio varejista de artigos de iluminação', invoiceType: 'NFE' },
  { code: '4754-7/01', description: 'Comércio varejista de móveis', invoiceType: 'NFE' },
  { code: '4755-5/03', description: 'Comércio varejista de artigos de cama, mesa e banho', invoiceType: 'NFE' },
  { code: '4756-3/00', description: 'Comércio varejista de artigos de armarinho', invoiceType: 'NFE' },
  { code: '4757-1/00', description: 'Comércio varejista de artigos de óptica', invoiceType: 'NFE' },
  { code: '4771-7/01', description: 'Comércio varejista de medicamentos (sem manipulação)', invoiceType: 'NFE' },
  { code: '4772-5/00', description: 'Comércio varejista de cosméticos, perfumaria e higiene pessoal', invoiceType: 'NFE' },
  { code: '4781-4/00', description: 'Comércio varejista de artigos do vestuário', invoiceType: 'NFE' },
  { code: '4782-2/01', description: 'Comércio varejista de calçados', invoiceType: 'NFE' },
  { code: '4783-1/01', description: 'Comércio varejista de artigos de joalheria e bijuteria', invoiceType: 'NFE' },
  { code: '4784-9/00', description: 'Comércio varejista de animais vivos e artigos para animais de estimação', invoiceType: 'NFE' },
  { code: '4789-0/99', description: 'Comércio varejista de outros produtos não especificados', invoiceType: 'NFE' },

  // ── Alimentação ────────────────────────────────────────────
  { code: '5611-2/01', description: 'Restaurante e similares', invoiceType: 'BOTH' },
  { code: '5611-2/03', description: 'Lanchonetes, casas de chá, sucos e similares', invoiceType: 'BOTH' },
  { code: '5620-1/01', description: 'Fornecimento de alimentos preparados preponderantemente para empresas', invoiceType: 'BOTH' },
  { code: '5620-1/03', description: 'Cantinas (serviços de alimentação privativos)', invoiceType: 'BOTH' },

  // ── Serviços de construção ─────────────────────────────────
  { code: '4330-4/02', description: 'Instalação de portas, janelas, tetos, divisórias e armários embutidos', invoiceType: 'NFSE' },
  { code: '4391-6/00', description: 'Obras de fundações', invoiceType: 'NFSE' },
  { code: '4399-1/01', description: 'Administração de obras', invoiceType: 'NFSE' },
  { code: '4311-8/02', description: 'Preparação de canteiro e limpeza de terreno', invoiceType: 'NFSE' },
  { code: '4312-6/00', description: 'Perfurações e sondagens', invoiceType: 'NFSE' },
  { code: '4313-4/00', description: 'Obras de terraplenagem', invoiceType: 'NFSE' },
  { code: '4321-5/00', description: 'Instalação e manutenção elétrica', invoiceType: 'NFSE' },
  { code: '4322-3/01', description: 'Instalações hidráulicas, sanitárias e de gás', invoiceType: 'NFSE' },
  { code: '4322-3/02', description: 'Instalação e manutenção de sistemas centrais de ar condicionado', invoiceType: 'NFSE' },
  { code: '4329-1/01', description: 'Instalação de painéis publicitários', invoiceType: 'NFSE' },
  { code: '4329-1/05', description: 'Tratamentos especializados de superfícies, revestimentos e recuperação', invoiceType: 'NFSE' },
  { code: '4330-4/01', description: 'Impermeabilização em obras de engenharia civil', invoiceType: 'NFSE' },
  { code: '4330-4/03', description: 'Obras de acabamento em gesso e estuque', invoiceType: 'NFSE' },
  { code: '4330-4/04', description: 'Serviços de pintura de edifícios em geral', invoiceType: 'NFSE' },
  { code: '4330-4/05', description: 'Aplicação de revestimentos e de resinas em interiores e exteriores', invoiceType: 'NFSE' },

  // ── Serviços gerais ────────────────────────────────────────
  { code: '9601-7/01', description: 'Lavanderias', invoiceType: 'NFSE' },
  { code: '9601-7/02', description: 'Tinturarias', invoiceType: 'NFSE' },
  { code: '9601-7/03', description: 'Toalheiros', invoiceType: 'NFSE' },
  { code: '9602-5/01', description: 'Cabeleireiros, manicure e pedicure', invoiceType: 'NFSE' },
  { code: '9609-2/02', description: 'Alinhamento e balanceamento de veículos automotores', invoiceType: 'NFSE' },
  { code: '9609-2/08', description: 'Higiene e embelezamento de animais domésticos', invoiceType: 'NFSE' },
  { code: '9609-2/99', description: 'Outras atividades de serviços pessoais não especificadas', invoiceType: 'NFSE' },
  { code: '8121-4/00', description: 'Limpeza em prédios e em domicílios', invoiceType: 'NFSE' },
  { code: '8129-0/00', description: 'Atividades de limpeza não especificadas', invoiceType: 'NFSE' },
  { code: '8011-1/01', description: 'Atividades de vigilância e segurança privada', invoiceType: 'NFSE' },
  { code: '7319-0/99', description: 'Outras atividades de publicidade não especificadas', invoiceType: 'NFSE' },
  { code: '7490-1/04', description: 'Atividades de intermediação e agenciamento de serviços e negócios', invoiceType: 'NFSE' },

  // ── Transporte ─────────────────────────────────────────────
  { code: '4930-2/01', description: 'Transporte rodoviário de carga, exceto produtos perigosos (municipal)', invoiceType: 'NFSE' },
  { code: '4930-2/02', description: 'Transporte rodoviário de carga, exceto produtos perigosos (intermunicipal)', invoiceType: 'NFSE' },
  { code: '4940-0/00', description: 'Transporte dutoviário', invoiceType: 'NFSE' },
  { code: '4950-7/00', description: 'Trens turísticos, teleféricos e similares', invoiceType: 'NFSE' },

  // ── Tecnologia ─────────────────────────────────────────────
  { code: '6201-5/01', description: 'Desenvolvimento de programas de computador sob encomenda', invoiceType: 'NFSE' },
  { code: '6201-5/02', description: 'Web design', invoiceType: 'NFSE' },
  { code: '6202-3/00', description: 'Desenvolvimento e licenciamento de programas de computador customizáveis', invoiceType: 'NFSE' },
  { code: '6203-1/00', description: 'Desenvolvimento e licenciamento de programas não customizáveis', invoiceType: 'NFSE' },
  { code: '6209-1/00', description: 'Suporte técnico, manutenção e outros serviços em TI', invoiceType: 'NFSE' },
  { code: '6311-9/00', description: 'Tratamento de dados, provedores de serviços de aplicação', invoiceType: 'NFSE' },
  { code: '6319-4/00', description: 'Portais, provedores de conteúdo e outros serviços de informação', invoiceType: 'NFSE' },

  // ── Manutenção e reparos ───────────────────────────────────
  { code: '9511-8/00', description: 'Reparação e manutenção de computadores e equipamentos periféricos', invoiceType: 'NFSE' },
  { code: '9512-6/00', description: 'Reparação e manutenção de equipamentos de comunicação', invoiceType: 'NFSE' },
  { code: '9521-5/00', description: 'Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico', invoiceType: 'NFSE' },
  { code: '9529-1/01', description: 'Reparação de calçados, bolsas e artigos de viagem', invoiceType: 'NFSE' },
  { code: '9529-1/02', description: 'Chaveiros', invoiceType: 'NFSE' },
  { code: '9529-1/03', description: 'Reparação de bijuterias e artigos de armarinho', invoiceType: 'NFSE' },
  { code: '9529-1/04', description: 'Reparação de equipamentos esportivos', invoiceType: 'NFSE' },
  { code: '9529-1/05', description: 'Reparação de artigos do mobiliário', invoiceType: 'NFSE' },
  { code: '9529-1/06', description: 'Reparação de jóias', invoiceType: 'NFSE' },
  { code: '9529-1/99', description: 'Reparação e manutenção de outros objetos e equipamentos pessoais', invoiceType: 'NFSE' },
  { code: '4520-0/01', description: 'Serviços de manutenção e reparação mecânica de veículos', invoiceType: 'NFSE' },
  { code: '4520-0/02', description: 'Serviços de lanternagem ou funilaria e pintura de veículos', invoiceType: 'NFSE' },
  { code: '4520-0/03', description: 'Serviços de manutenção e reparação elétrica de veículos', invoiceType: 'NFSE' },

  // ── Saúde / Bem-estar ──────────────────────────────────────
  { code: '8630-5/04', description: 'Atividade odontológica', invoiceType: 'NFSE' },
  { code: '8650-0/01', description: 'Atividades de enfermagem', invoiceType: 'NFSE' },
  { code: '8650-0/02', description: 'Atividades de profissionais da nutrição', invoiceType: 'NFSE' },
  { code: '8650-0/03', description: 'Atividades de psicologia e psicanálise', invoiceType: 'NFSE' },
  { code: '8650-0/04', description: 'Atividades de fisioterapia', invoiceType: 'NFSE' },
  { code: '8650-0/06', description: 'Atividades de fonoaudiologia', invoiceType: 'NFSE' },
  { code: '9313-1/00', description: 'Atividades de condicionamento físico', invoiceType: 'NFSE' },

  // ── Educação / Cultura ─────────────────────────────────────
  { code: '8599-6/04', description: 'Treinamento em desenvolvimento profissional e gerencial', invoiceType: 'NFSE' },
  { code: '8599-6/99', description: 'Outras atividades de ensino não especificadas', invoiceType: 'NFSE' },
  { code: '9001-9/01', description: 'Produção teatral', invoiceType: 'NFSE' },
  { code: '9001-9/02', description: 'Produção musical', invoiceType: 'NFSE' },
  { code: '9001-9/06', description: 'Atividades de sonorização e de iluminação', invoiceType: 'NFSE' },
  { code: '7420-0/01', description: 'Atividades de produção de fotografias', invoiceType: 'NFSE' },
  { code: '7420-0/02', description: 'Atividades de produção de fotografias aéreas e submarinas', invoiceType: 'NFSE' },
  { code: '7420-0/03', description: 'Laboratórios fotográficos', invoiceType: 'NFSE' },
];

export function findCnaeMei(code: string): CnaeMei | undefined {
  const normalized = code.replace(/\s/g, '');
  return CNAES_MEI.find((c) => c.code.replace(/\s/g, '') === normalized);
}

export function isCnaeMeiAllowed(code: string): boolean {
  return !!findCnaeMei(code);
}
