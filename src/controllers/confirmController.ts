import { Request, Response } from 'express';
import { validateConfirmData } from '../services/validationService';
import { checkMeasureExists, checkMeasureConfirmed, updateMeasureValue } from '../services/measureService';

export const confirmController = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Validar os dados recebidos
    const validationError = validateConfirmData({ measure_uuid, confirmed_value });
    if (validationError) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: validationError,
      });
    }

    // Verificar se o código de leitura existe
    const measureExists = await checkMeasureExists(measure_uuid);
    if (!measureExists) {
      return res.status(404).json({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      });
    }

    // Verificar se o código de leitura já foi confirmado
    const alreadyConfirmed = await checkMeasureConfirmed(measure_uuid);
    if (alreadyConfirmed) {
      return res.status(409).json({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      });
    }

    // Atualizar o valor confirmado no banco de dados
    await updateMeasureValue(measure_uuid, confirmed_value);

    // Retornar sucesso
    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error('Error processing confirmation:', error);
    return res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Ocorreu um erro no servidor.',
    });
  }
};