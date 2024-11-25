import { Router } from 'express';
import {  getItems, getItem, updateItem, deleteItem, startCrawler, getDataChartsController } from '../controllers/web-scraping.controller';

const router = Router();

router.post('/save', startCrawler);
router.get('/charts', getDataChartsController);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.get('/', getItems);


export default router;
