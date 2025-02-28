import * as yup from 'yup';

yup.setLocale({
  mixed: {
    default: 'O campo é inválido.',
    required: 'O campo é obrigatório.',
    oneOf: 'O campo deve ter um dos seguintes valores: ${values}.',
    notOneOf: 'O campo não deve ter nenhum dos seguintes valores: ${values}.',
    defined: 'O campo não deve ser indefinido.',
  },
  string: {
    length: ({ length }) =>
      `O campo deve ter exatamente ${length} ${length === 1 ? 'caractere' : 'caracteres'}.`,
    min: ({ min }) =>
      `O campo deve ter pelo menos ${min} ${min === 1 ? 'caractere' : 'caracteres'}.`,
    max: ({ max }) =>
      `O campo deve ter no máximo ${max} ${max === 1 ? 'caractere' : 'caracteres'}.`,
    matches: 'O campo deve corresponder ao padrão: "${regex}".',
    email: 'O campo deve ser um e-mail válido.',
    url: 'O campo deve ser uma URL válida.',
    trim: 'O campo não deve conter espaços adicionais no início nem no fim.',
    lowercase: 'O campo deve estar em letras minúsculas.',
    uppercase: 'O campo deve estar em letras maiúsculas.',
  },
  number: {
    integer: 'O campo deve ser um número inteiro.',
    min: 'O campo deve ser maior ou igual a ${min}.',
    max: 'O campo deve menor ou igual a ${max}.',
    lessThan: 'O campo deve ser menor que ${less}.',
    moreThan: 'O campo deve ser maior que ${more}.',
    positive: 'O campo deve ser um número positivo.',
    negative: 'O campo deve ser um número negativo.',
  },
  date: {
    min: 'O campo deve ser maior ou igual a ${min}.',
    max: 'O campo deve menor ou igual a ${max}.',
  },
  array: {
    min: ({ min }) =>
      `O campo deve ter pelo menos ${min} ${min === 1 ? 'item' : 'itens'}.`,
    max: ({ max }) =>
      `O campo deve ter no máximo ${max} ${max === 1 ? 'item' : 'itens'}.`,
    length: ({ length }) =>
      `O campo deve ter exatamente ${length} ${length === 1 ? 'item' : 'itens'}.`,
  },
});

function isValidCPF(cpf: string | undefined) {
  if (!cpf) {
    return false;
  }

  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return false;
  }

  return true;
}

yup.addMethod<yup.StringSchema>(
  yup.string,
  'cpf',
  function (message = 'CPF inválido.') {
    return this.test('cpf', message, function (value) {
      const { path, createError } = this;
      return isValidCPF(value) || createError({ path, message });
    });
  },
);

function isValidPhone(phone: string | undefined) {
  if (!phone) {
    return false;
  }

  const phoneRegex = /^\([1-9]{2}\)\s9[2-9]\d{3}-\d{4}$/;

  if (!phoneRegex.test(phone)) {
    return false;
  }

  return true;
}

yup.addMethod<yup.StringSchema>(
  yup.string,
  'phone',
  function (
    message = 'Digite um telefone válido, no formato (99) 99999-9999.',
  ) {
    return this.test('phone', message, function (value) {
      const { path, createError } = this;
      return isValidPhone(value) || createError({ path, message });
    });
  },
);

function minWords(min: number, value: string | undefined) {
  if (!value) {
    return false;
  }

  const words = value.trim().split(/\s+/);

  return words.length >= min;
}

yup.addMethod<yup.StringSchema>(
  yup.string,
  'minWords',
  function (min = 2, message) {
    message = message || 'O campo deve ter pelo menos ' + min + ' palavras.';

    return this.test('cpf', message, function (value) {
      const { path, createError } = this;
      return minWords(min, value) || createError({ path, message });
    });
  },
);

declare module 'yup' {
  interface StringSchema {
    cpf(message?: string): this;
    phone(message?: string): this;
    minWords(min: number, message?: string): this;
  }
}

export * from 'yup';
