
import { Request,Response } from 'express';
import ItemService from '../services/data.service';
import { Item } from '../models/data.interface';

export const createItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await ItemService.createItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error desconocido' });
        }
    }
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await ItemService.getItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await ItemService.getItem(req.params.id);
        if (!item) 
         res.status(404).json({ message: 'Item no encontrado' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await ItemService.updateItem(req.params.id, req.body);
        if (!item)  
        res.status(404).json({ message: 'Item no encontrado' });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await ItemService.deleteItem(req.params.id);
        if (!item)  
        res.status(404).json({ message: 'Item no encontrado' });
        res.json({ message: 'Item eliminado' });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};
