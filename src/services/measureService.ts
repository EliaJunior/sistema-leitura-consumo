import { db } from '../db/db'
import sql from 'mssql';

// Verifica se a leitura existe
export const checkMeasureExists = async (measure_uuid: string): Promise<boolean> => {
    try {
        const pool = await db();
        const result = await pool.request()
            .input('uuid', sql.VarChar, measure_uuid)
            .query('SELECT COUNT(*) AS count FROM Leituras WHERE measure_uuid = @uuid');

        return result.recordset[0].count > 0;
    } catch (error) {
        console.error('Error checking measure existence:', error);
        throw new Error('Erro ao verificar se a leitura existe.');
    }
};

// Verifica se a leitura já foi confirmada
export const checkMeasureConfirmed = async (measure_uuid: string): Promise<boolean> => {
    try {
        const pool = await db();
        const result = await pool.request()
            .input('uuid', sql.VarChar, measure_uuid)
            .query('SELECT is_confirmed FROM Leituras WHERE measure_uuid = @uuid');

        return result.recordset[0].is_confirmed;
    } catch (error) {
        console.error('Error checking measure confirmation:', error);
        throw new Error('Erro ao verificar se a leitura já foi confirmada.');
    }
};

// Atualiza o valor confirmado
export const updateMeasureValue = async (measure_uuid: string, confirmed_value: number): Promise<void> => {
    try {
        const pool = await db();
        await pool.request()
            .input('uuid', sql.VarChar, measure_uuid)
            .input('confirmed', sql.Bit, true)
            .input('confirmed_value', sql.Int, confirmed_value)
            .query('UPDATE Leituras SET is_confirmed = @confirmed, confirmed_value = @confirmed_value WHERE measure_uuid = @uuid');
    } catch (error) {
        console.error('Error updating measure value:', error);
        throw new Error('Erro ao atualizar o valor confirmado.');
    }
};

export const getMeasuresByCustomerCode = async (customer_code: string, measure_type?: string) => {
    try {
      const pool = await db();
  
      // Verificar se o parâmetro measure_type está definido e é válido
      if (measure_type && !['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
        throw new Error('Invalid measure_type');
      }
  
      // Construir a consulta SQL
      let query = `
        SELECT *
        FROM Leituras
        WHERE customer_id = @customer_code
      `;
  
      // Adicionar o filtro measure_type se presente
      if (measure_type) {
        query += ' AND measure_type = @measure_type';
      }
  
      // Preparar e executar a consulta
      const request = pool.request()
        .input('customer_code', customer_code);
  
      if (measure_type) {
        request.input('measure_type', measure_type.toUpperCase());
      }
  
      const result = await request.query(query);
  
      // Retornar os resultados (ou um array vazio se não houver registros)
      return result.recordset;
  
    } catch (error) {
      console.error('Error fetching measures from database:', error);
      throw new Error('Failed to fetch measures');
    }
  };