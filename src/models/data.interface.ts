import mongoose, { Document, Schema } from 'mongoose';

interface IItem extends Document {
    name: string;
    description?: string;
    price?: number;
    state?: string
}

const itemSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
});

const Item = mongoose.model<IItem>('Item', itemSchema);

export { Item, IItem };
