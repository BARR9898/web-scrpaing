import { Router } from 'express';
import {  getItems, getItem, updateItem, deleteItem, startCrawler } from '../controllers/web-scraping.controller';

const router = Router();

router.post('/save', startCrawler);
router.get('/', getItems);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
