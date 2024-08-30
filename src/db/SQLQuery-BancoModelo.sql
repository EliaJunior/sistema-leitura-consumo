-- CRIA O BANCO DE DADOS
CREATE DATABASE ConsumoMedidoresDB

-- CRIA A TABELA CLIENTES
CREATE TABLE Clientes (
    customer_id INT PRIMARY KEY IDENTITY(1,1),
    customer_code VARCHAR(50) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200),
    telefone VARCHAR(20),
    email VARCHAR(100),
    created_at DATETIME DEFAULT GETDATE()
);

-- INSERE ALGUNS CLIENTES FICTICIOS
INSERT INTO Clientes (customer_code, nome, endereco, telefone, email)
VALUES ('12345', 'João Silva', 'Rua A, 123', '9999-9999', 'joao@example.com'),
       ('67890', 'Maria Oliveira', 'Rua B, 456', '8888-8888', 'maria@example.com');

-- CRIA A TABELA LEITURAS
CREATE TABLE Leituras (
    leitura_id INT PRIMARY KEY IDENTITY(1,1),
    measure_uuid UNIQUEIDENTIFIER DEFAULT NEWID(), -- UUID único para cada leitura
    customer_id INT NOT NULL,
    measure_datetime DATETIME NOT NULL,
    measure_type VARCHAR(10) CHECK (measure_type IN ('WATER', 'GAS')),
    measure_value INT NOT NULL,
    confirmed_value INT,
    is_confirmed BIT DEFAULT 0,						-- 0 para não confirmado, 1 para confirmado
    created_at DATETIME DEFAULT GETDATE(),
    confirmed_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES Clientes(customer_id)
);

-- INSERE ALGUMAS LEITURAS FICTICIAS
INSERT INTO Leituras (customer_id, measure_datetime, measure_type, measure_value)
VALUES (1, 2024-08-30, 'WATER', 120),
       (2, 2024-08-30, 'GAS', 50);

-- CONSULTA DOS DADOS 
SELECT 
    l.measure_uuid, l.measure_datetime, l.measure_type, l.measure_value, l.confirmed_value, l.is_confirmed,
    c.nome, c.customer_code
FROM 
    Leituras l
JOIN 
    Clientes c ON l.customer_id = c.customer_id;