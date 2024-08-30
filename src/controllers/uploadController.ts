import { Request, Response } from 'express';
import { validateUploadData } from '../services/validationService';
import { uploadImage, generateContentFromImage } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const extractMimeTypeFromBase64 = (base64String: string): string | null => {
    // Expressão regular para capturar o mimeType
    const mimeTypePattern = /^data:(image\/[a-zA-Z]+);base64,/;
    const match = base64String.match(mimeTypePattern);

    if (match && match[1]) {
        return match[1];
    }

    return null;
};

export const uploadController = async (req: Request, res: Response) => {
    try {
        const { image, customer_code, measure_datetime, measure_type } = req.body;

        // Validar os dados recebidos
        const validationError = validateUploadData({ image, customer_code, measure_datetime, measure_type });
        if (validationError) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: validationError,
            });
        }
        // Verificar se já existe uma leitura no mês para o cliente e tipo de medição
        // TODO: Implementar essa verificação no banco de dados

        // Integração com a API de LLM para extrair o valor da imagem
        // Extração do mimeType
        const mimeType = extractMimeTypeFromBase64(image)!;

        // upload da imagem e retorno do URI
        const imageUri = await uploadImage(image, mimeType);

        // Captura do consumo do medidor
        const measureValueString = await generateContentFromImage(imageUri, mimeType);

        // Converte o valor para inteiro
        const measureValue = parseInt(measureValueString, 10);

        // Verifica se a conversão foi bem-sucedida
        if (isNaN(measureValue)) {
            throw new Error('Inválido');
        }

        // Gerar um UUID
        const measureUuid = uuidv4();

        // Retorno
        return res.status(200).json({
            image_url: imageUri,
            measure_value: measureValue,
            measure_uuid: measureUuid,
        });

    } catch (error) {
        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Ocorreu um erro no servidor.',
        });
    }
};
