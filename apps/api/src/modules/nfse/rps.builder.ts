export function buildRps(input: { invoiceId: string; customerName: string; customerTaxId: string; serviceCity: string; totalAmount: number; itemDescription: string; }) {
  return {
    numero: input.invoiceId,
    tomador: { nome: input.customerName, cpfCnpj: input.customerTaxId },
    servico: { municipio: input.serviceCity, descricao: input.itemDescription, valor: input.totalAmount },
  };
}
