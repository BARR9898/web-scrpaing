import { Item,IItem } from "../models/data.interface";
import {Product} from "../models/products.model";

class ItemService {
    async saveItemsService(data: Partial<IItem>): Promise<IItem> {
        const item = new Item(data);
        return await item.save();
    }
                                                                                                                                   
    async getItems(): Promise<IItem[]> {
        console.log('PRODUCT',Product);
        
        return await Product.find();
    }

    async getItem(id: string): Promise<IItem | null> {
        return await Product.findById(id);
    }

    async updateItem(id: string, data: Partial<IItem>): Promise<IItem | null> {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteItem(id: string): Promise<IItem | null> {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ItemService();
