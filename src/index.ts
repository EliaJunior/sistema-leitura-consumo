import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes';
import confirmRoutes from './routes/confirmRoutes';
import listMeasureRoutes from './routes/listMeasuresRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Use as rotas de upload
app.use('/api', uploadRoutes);
app.use('/api', confirmRoutes);
app.use('/api', listMeasureRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
