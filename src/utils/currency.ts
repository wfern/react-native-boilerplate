export function BRL(value: string | number) {
  if (typeof value === 'string') {
    value = +value;
  }

  let mask = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return mask;
}
