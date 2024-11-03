import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './configs/db';
import itemRoutes from './routes/routes';

const app = express();
connectDB();

app.use(bodyParser.json());
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
