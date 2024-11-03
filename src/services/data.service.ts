import { Item,IItem } from "../models/data.interface";

class ItemService {
    async createItem(data: Partial<IItem>): Promise<IItem> {
        const item = new Item(data);
        return await item.save();
    }

    async getItems(): Promise<IItem[]> {
        return await Item.find();
    }

    async getItem(id: string): Promise<IItem | null> {
        return await Item.findById(id);
    }

    async updateItem(id: string, data: Partial<IItem>): Promise<IItem | null> {
        return await Item.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteItem(id: string): Promise<IItem | null> {
        return await Item.findByIdAndDelete(id);
    }
}

export default new ItemService();
