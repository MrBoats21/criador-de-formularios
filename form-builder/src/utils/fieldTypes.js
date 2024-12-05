export const fieldTypes = {
    text: {
      label: 'Texto',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        minLength: { type: 'number', label: 'Comprimento mínimo' },
        maxLength: { type: 'number', label: 'Comprimento máximo' },
        pattern: { type: 'text', label: 'Expressão regular' }
      }
    },
    textarea: {
      label: 'Área de Texto',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        minLength: { type: 'number', label: 'Comprimento mínimo' },
        maxLength: { type: 'number', label: 'Comprimento máximo' },
        rows: { type: 'number', label: 'Número de linhas' }
      }
    },
    number: {
      label: 'Número',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        min: { type: 'number', label: 'Valor mínimo' },
        max: { type: 'number', label: 'Valor máximo' },
        step: { type: 'number', label: 'Incremento' }
      }
    },
    email: {
      label: 'Email',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        customDomain: { type: 'text', label: 'Domínio permitido' }
      }
    },
    phone: {
      label: 'Telefone',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        format: { type: 'select', label: 'Formato', options: ['(99) 9999-9999', '(99) 99999-9999'] }
      }
    },
    date: {
      label: 'Data',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        minDate: { type: 'date', label: 'Data mínima' },
        maxDate: { type: 'date', label: 'Data máxima' }
      }
    },
    time: {
      label: 'Hora',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        minTime: { type: 'time', label: 'Hora mínima' },
        maxTime: { type: 'time', label: 'Hora máxima' }
      }
    },
    select: {
      label: 'Seleção',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        options: { type: 'array', label: 'Opções' }
      }
    },
    multiSelect: {
      label: 'Múltipla Escolha',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        options: { type: 'array', label: 'Opções' },
        minSelect: { type: 'number', label: 'Mínimo de seleções' },
        maxSelect: { type: 'number', label: 'Máximo de seleções' }
      }
    },
    checkbox: {
      label: 'Checkbox',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        defaultChecked: { type: 'checkbox', label: 'Marcado por padrão' }
      }
    },
    radio: {
      label: 'Radio',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        options: { type: 'array', label: 'Opções' }
      }
    },
    file: {
      label: 'Arquivo',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        maxSize: { type: 'number', label: 'Tamanho máximo (MB)' },
        allowedTypes: { 
          type: 'multiSelect', 
          label: 'Tipos permitidos',
          options: ['image/*', 'application/pdf', '.doc,.docx', '.xls,.xlsx']
        }
      }
    },
    signature: {
      label: 'Assinatura',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        width: { type: 'number', label: 'Largura' },
        height: { type: 'number', label: 'Altura' }
      }
    },
    cpf: {
      label: 'CPF',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        validate: { type: 'checkbox', label: 'Validar número' }
      }
    },
    cnpj: {
      label: 'CNPJ',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        validate: { type: 'checkbox', label: 'Validar número' }
      }
    },
    cep: {
      label: 'CEP',
      validations: {
        required: { type: 'checkbox', label: 'Obrigatório' },
        autoComplete: { type: 'checkbox', label: 'Autocompletar endereço' }
      }
    }
};