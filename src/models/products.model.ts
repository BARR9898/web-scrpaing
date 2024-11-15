import mongoose, { Schema, Document } from 'mongoose';

// Definir la interfaz que describe la estructura del producto
interface IProduct extends Document {
  title: string;
  price: string;
  url: string;
  imageUrl: string;
}

// Definir el esquema del producto
const productSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  price: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true }); // timestamps agregará las fechas de creación y actualización

// Crear el modelo a partir del esquema
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
