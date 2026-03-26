export function mapToFocusPayload(input: {
  invoiceId: string;
  customerName: string;
  customerTaxId: string;
  naturezaOperacao: string;
  cfop?: string;
  totalAmount: number;
  itemDescription: string;
}) {
  return {
    natureza_operacao: input.naturezaOperacao,
    consumidor_final: true,
    destinatario: { nome: input.customerName, cpf_cnpj: input.customerTaxId },
    items: [{ numero_item: 1, descricao: input.itemDescription, cfop: input.cfop, quantidade_comercial: 1, valor_unitario_comercial: input.totalAmount }],
    referencia: input.invoiceId,
  };
}
