import { Product } from "../models/products.model";

import { Builder, By, until } from 'selenium-webdriver'; // Importa desde 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'; // Importa la librería de Chrome
import { MongoClient } from 'mongodb'; // Importa MongoClient desde 'mongodb'
import path from 'path'; // Importa el módulo 'path'
import { fileURLToPath } from 'url'; 

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);  // Esto obtiene el nombre del archivo
const __dirname = path.dirname(__filename);  // Esto obtiene el directorio del archivo

// Define el límite de productos a procesar
const maxProducts = 10; // Número máximo de productos que deseas procesar

async function scrapeData() {
  // Inicia el navegador
  const options = new chrome.Options();
  options.addArguments('headless'); // Ejecutar en segundo plano sin abrir una ventana del navegador

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Accede a la página de Mercado Libre
    await driver.get('https://listado.mercadolibre.com.mx/celualres#D[A:celualres]');

    // Espera a que la página cargue completamente
    await driver.wait(until.elementLocated(By.css('.ui-search-results')));

    // Extrae los enlaces de los productos en la página de listado
    const productLinks = await driver.findElements(By.css('.ui-search-link'));

    let products = [];
    let productCount = 0;

    // Iterar sobre los enlaces de los productos
    for (let productLink of productLinks) {
      if (productCount >= maxProducts) {
        console.log(`Límite de productos alcanzado: ${maxProducts}`);
        break; // Detener el proceso cuando se alcanza el límite
      }

      const url = await productLink.getAttribute('href');
      console.log(`Entrando a: ${url}`);

      // Navegar al enlace del producto
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('.ui-vpp-highlighted-specs__striped-specs')));

      // Extraer la información del producto
      let title = await driver.findElement(By.css('.ui-pdp-title')).getText();
      let price = await driver.findElement(By.css('.price__fraction')).getText();
      let image = await driver.findElement(By.css('.ui-pdp-image')).getAttribute('src');

      // Extraer características del producto
      let characteristics:any = {};
      const characteristicsTable = await driver.findElements(By.css('.specs-table tr'));

      for (let row of characteristicsTable) {
        const cells = await row.findElements(By.css('td'));

        if (cells.length === 2) {
          const key = await cells[0].getText();
          const value = await cells[1].getText();

          // Guardamos las características relevantes
          if (key.includes('Memoria Interna')) {
            characteristics.internalMemory = value;
          } else if (key.includes('Memoria RAM')) {
            characteristics.ramMemory = value;
          } else if (key.includes('Modelo de CPU')) {
            characteristics.cpuModel = value;
          } else if (key.includes('Modelo de GPU')) {
            characteristics.gpuModel = value;
          }
        }
      }

      // Agregar el producto con sus características a la lista
      products.push({
        title,
        price,
        url,
        image,
        characteristics
      });

      // Incrementar el contador de productos procesados
      productCount++;

      // Volver a la página de listado
      await driver.navigate().back();
      await driver.wait(until.elementLocated(By.css('.ui-search-results')), 10000);
    }

    // Imprime los resultados en consola (puedes eliminar esto si no lo necesitas)
    console.log(products);

    /* Conexión a MongoDB
    const client = new MongoClient('mongodb://localhost:27017'); // Cambia si usas MongoDB en un servidor remoto
    await client.connect();
    const db = client.db('mercadolibre');
    const collection = db.collection('products');
    */

    // Inserta los productos en la colección 'products'
    if (products.length > 0) {
      await Product.insertMany(products);
      console.log('Datos guardados en MongoDB.');
    } else {
      console.log('No se encontraron productos para guardar.');
    }


  } catch (error) {
    console.error('Error en el scraping:', error);
  } finally {
    // Cierra el navegador
    await driver.quit();
  }
}



// Ejecuta la función de scraping
export {scrapeData}
