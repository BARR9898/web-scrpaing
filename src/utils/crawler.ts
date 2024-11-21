
import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import {Product} from '../models/products.model';
import delay from 'delay';

const MONGO_URI = 'mongodb://localhost:27017/webcrawler'; // Cambia según tu configuración
let BASE_URL = '';
const MAX_RETRIES = 3; // Número máximo de reintentos
const MAX_PRODUCTS = 3; // Limitar el scraping a 10 productos

let scrapedProductsCount = 0; // Contador de productos scrapeados

async function connectToMongoDB() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
}

// Función para hacer scraping de un producto específico
async function scrapeProduct(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  const product = await page.evaluate(() => {
    const title = document.querySelector('.ui-pdp-title')?.textContent?.trim() || '';
    const price = document.querySelector('.andes-money-amount__fraction')?.textContent?.trim() || '';
    const popularity = document.querySelector('.ui-pdp-review__rating')?.textContent?.trim() || '0';
    const imageUrl = document.querySelector('.ui-pdp-gallery__figure img')?.getAttribute('src') || '';

    

    return { title, price, url: window.location.href, imageUrl,popularity };
  });

  
  await new Product(product).save();
  console.log(`Product saved: ${product.title}`);
  await browser.close();

  scrapedProductsCount++; // Incrementamos el contador de productos scrapeados
}

// Función para manejar reintentos
async function scrapeWithRetries(url: string, retries: number = MAX_RETRIES) {
  try {
    await scrapeProduct(url);
  } catch (error) {
    console.log('error scraping',error);
    
    if (retries > 0) {
      console.log(`Error scraping ${url}. Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await delay(2000); 
      await scrapeWithRetries(url, retries - 1);
    } else {
      console.error(`Failed to scrape ${url} after ${MAX_RETRIES} attempts.`);
    }
  }
}

// Crawl de una página específica y scrape de productos en paralelo
async function crawlPage(page: any) {
  await page.waitForSelector('.poly-box', { timeout: 5000, visible: true });
  const productLinks = await page.$$eval('.poly-box a', (links: any) => links.map((link: HTMLAnchorElement) => link.href));


  // Limitar el número de productos a 10
  const limitedProductLinks = productLinks.slice(0, MAX_PRODUCTS - scrapedProductsCount);
  
  await Promise.all(limitedProductLinks.map(scrapeWithRetries)); // Scrape de productos en paralelo
}

// Maneja la paginación y va a la siguiente página si es posible
async function crawlPagination(page: any) {
  const nextPageButton = await page.$('.andes-pagination__button--next');
  if (nextPageButton && scrapedProductsCount < MAX_PRODUCTS) {
    const nextPageUrl = await page.evaluate((button: any) => {
      return button?.parentElement?.getAttribute('href') ? `https://listado.mercadolibre.com.mx${button.parentElement.getAttribute('href')}` : null;
    }, nextPageButton);
    
    if (nextPageUrl) {
      console.log(`Crawling next page: ${nextPageUrl}`);
      await page.goto(nextPageUrl, { waitUntil: 'load', timeout: 0 });
      await crawlPage(page);
      await crawlPagination(page); // Recursión para la siguiente página
    }
  }
}

// Función principal para iniciar el crawling con control de tasa
async function startCrawling() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'load', timeout: 0 });

  await crawlPage(page);
  await crawlPagination(page);
  await browser.close();
}

// Función para ejecutar el crawling con retraso entre iteraciones
async function startCrawlingWithRateLimit() {
  await startCrawling();
  await delay(5000);  // Espera 5 segundos entre ejecuciones
  console.log('Crawl finished!');
}

// Inicia el proceso
async function main(url:string) {
  console.log('main');
  
  if (url == '' || url == undefined) {
    throw new Error("URL can be empty");
    
  }else{
    BASE_URL = url
    await startCrawlingWithRateLimit();

  }
}


export {main}
