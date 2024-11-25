
import { Request, Response } from 'express';
import ItemService from '../services/data.service';
import { scrapeData } from '../utils/crawler2';
import { main } from '../utils/crawler';

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
        console.log('delete item params',req.params.id);
        
        const item = await ItemService.deleteItem(req.params.id);
        console.log('item removed',item);
        
        if (!item)
            res.status(404).json({ message: 'Item no encontrado' });
        else{
            res.json({ message: 'Item eliminado' });
        }
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const getDataChartsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await ItemService.getDataToCharts();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const startCrawler = async (req: Request, res: Response): Promise<void> => {
    try {
        const URL = req.body.url
        console.log('entra');
        console.log('URL',req.body.url);

        main(URL)
            .then(() => {
                console.log('Scraping successfull');  
            })
            .catch((error:any) => {
                console.log('Scraping error', error); 
            })
        

    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};
