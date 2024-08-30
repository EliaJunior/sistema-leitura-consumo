import { Request, Response } from 'express';
import { getMeasuresByCustomerCode } from '../services/measureService';

export const listMeasuresController = async (req: Request, res: Response) => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    // Validação do parâmetro measure_type
    if (measure_type && !['WATER', 'GAS'].includes((measure_type as string).toUpperCase())) {
      return res.status(400).json({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }

    // Buscar medidas do cliente
    const measures = await getMeasuresByCustomerCode(customer_code, measure_type as string);

    if (measures.length === 0) {
      return res.status(404).json({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    // Responder com sucesso
    return res.status(200).json({
      customer_code,
      measures,
    });

  } catch (error) {
    console.error('Error fetching measures:', error);
    return res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Ocorreu um erro no servidor.',
    });
  }
};
