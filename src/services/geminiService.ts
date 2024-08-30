import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Inicializando o File Manager com a API Key do Gemini
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Função para fazer o upload da imagem
export const uploadImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        // Remove o prefixo "data:image/jpeg;base64," do base64, se estiver presente
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        // Salva a imagem em um arquivo temporário
        const tempFilePath = path.join(__dirname, 'temp-image.jpg');
        fs.writeFileSync(tempFilePath, base64Data, 'base64');

        // Fazendo upload da imagem para o Gemini
        const uploadResponse = await fileManager.uploadFile(tempFilePath, {
            mimeType: mimeType,
            displayName: 'Uploaded Image'
        });

        // Remove o arquivo temporário
        fs.unlinkSync(tempFilePath);

        // Retorne o URI da imagem
        return uploadResponse.file.uri;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Erro ao fazer upload da imagem.');
    }
};

// Função para gerar o conteúdo usando a imagem URI
export const generateContentFromImage = async (imageUri: string, mimeType: string) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        // Fazendo a chamada para gerar conteúdo com a imagem e um comando de texto
        const result = await model.generateContent([
            "Extraia o consumo desse medidor, responda com um valor do tipo inteiro.",
            {
                fileData: {
                    mimeType: mimeType,
                    fileUri: imageUri,
                },
            },
        ]);

        const measureValue = result.response.text();

        return measureValue;
    } catch (error) {
        console.error("Erro ao gerar conteúdo a partir da imagem:", error);
        throw new Error("Erro ao obter valor da imagem");
    }
};