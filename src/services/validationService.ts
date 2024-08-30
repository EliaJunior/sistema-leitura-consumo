export const validateUploadData = (data: { image: string, customer_code: string, measure_datetime: string, measure_type: string }) => {
    const { image, customer_code, measure_datetime, measure_type } = data;
  
    // Verifica se a imagem está no formato base64
    const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/;
    if (!image || typeof image !== 'string' || !base64Pattern.test(image)) {
      return 'Imagem inválida ou não fornecida. Deve ser uma string base64 no formato data URI.';
    }
  
    // Verifica se o código do cliente é uma string não vazia
    if (!customer_code || typeof customer_code !== 'string' || customer_code.trim() === '') {
      return 'Código do cliente inválido ou não fornecido.';
    }
  
    // Verifica se a data está no formato correto (ISO 8601)
    const parsedDate = new Date(measure_datetime);
    if (!measure_datetime || isNaN(parsedDate.getTime())) {
      return 'Data da medição inválida ou não fornecida. Formato ISO 8601 (YYYY-MM-DD).';
    }
  
    // Verifica se o tipo de medição é válido
    if (measure_type !== 'WATER' && measure_type !== 'GAS') {
      return 'Tipo de medição inválido, deve ser "WATER" ou "GAS".';
    }
  
    // Se tudo estiver válido, retorna null
    return null;
  };
  
  export const validateConfirmData = (data: { measure_uuid: string, confirmed_value: number }) => {
    const { measure_uuid, confirmed_value } = data;
  
    // Validação básica para os campos
    if (!measure_uuid || typeof measure_uuid !== 'string') {
      return 'UUID da leitura inválido ou não fornecido';
    }
    if (typeof confirmed_value !== 'number' || isNaN(confirmed_value)) {
      return 'Valor confirmado inválido ou não fornecido';
    }
  
    // Se tudo estiver válido, retorna null
    return null;
};