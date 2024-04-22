/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const uuid = require('uuid');
const { CosmosClient } = require('@azure/cosmos');

const DB_ENDPOINT = process.env.COSMOS_ENDPOINT;
const DB_KEY = process.env.COSMOS_KEY;
const DB_ID = 'products-db';
const PRODUCTS_CONTAINER_ID = 'products';
const STOCK_CONTAINER_ID = 'stock';

const dbClient = new CosmosClient({ endpoint: DB_ENDPOINT, key: DB_KEY });

const getProductMock = (index) => ({
  id: uuid.v4(),
  title: `Product ${index}`,
  description: `Product ${index} description`,
  price: Math.round(((Math.random() * 10 + index) * 100) / 100),
});

const getStockMock = (productId) => ({
  product_id: productId,
  count: Math.ceil(Math.random() * 10),
});

const productsMock = Array.from({ length: 10 }, (_, index) => getProductMock(index));

async function main() {
  const { database } = await dbClient.databases.createIfNotExists({ id: DB_ID });
  const { container: productContainer } = await database.containers.createIfNotExists({ id: PRODUCTS_CONTAINER_ID });
  const { container: stockContainer } = await database.containers.createIfNotExists({ id: STOCK_CONTAINER_ID });
  for await (const product of productsMock) {
    await productContainer.items.create(product);
    const stock = getStockMock(product.id);
    await stockContainer.items.create(stock);
  }
}

try {
  main();
} catch (e) {
  console.log(e);
}
