export const validateCompany = (data) => {
    const errors = {};
  
    // Nome obrigatório e mínimo 3 caracteres
    if (!data.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (data.name.trim().length < 3) {
      errors.name = 'Nome deve ter no mínimo 3 caracteres';
    }
  
    // Validação de cores em formato hexadecimal
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    
    if (!data.backgroundColor?.match(hexColorRegex)) {
      errors.backgroundColor = 'Cor de fundo deve estar em formato hexadecimal (ex: #FFFFFF)';
    }
  
    if (!data.primaryColor?.match(hexColorRegex)) {
      errors.primaryColor = 'Cor primária deve estar em formato hexadecimal (ex: #000000)';
    }
  
    if (!data.secondaryColor?.match(hexColorRegex)) {
      errors.secondaryColor = 'Cor secundária deve estar em formato hexadecimal (ex: #000000)';
    }
  
    // Validação do arquivo de logo
    if (data.logoFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!data.logoFile.type.startsWith('image/')) {
        errors.logoFile = 'Arquivo deve ser uma imagem';
      } else if (data.logoFile.size > maxSize) {
        errors.logoFile = 'Imagem deve ter no máximo 5MB';
      }
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };