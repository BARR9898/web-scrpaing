import { Router } from 'express';
import { createItem, getItems, getItem, updateItem, deleteItem } from '../controllers/web-scraping.controller';

const router = Router();

router.post('/', createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
