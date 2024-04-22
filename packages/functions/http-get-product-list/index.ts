import { AzureFunction, Context } from '@azure/functions';
import { createDbClient, DB_ID, PRODUCTS_CONTAINER_ID, QUERY_ALL, STOCK_CONTAINER_ID } from '../common';
import { FeedResponse } from '@azure/cosmos';
import { Product, ProductDTO, Stock } from '../types';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
  context.log('Get all products triggered');
  const dbClient = await createDbClient(context);
  const productContainer = dbClient.database(DB_ID).container(PRODUCTS_CONTAINER_ID);
  const stockContainer = dbClient.database(DB_ID).container(STOCK_CONTAINER_ID);
  const productQueryResponse: FeedResponse<Product> = await productContainer.items.query(QUERY_ALL).fetchAll();
  const stockQueryResponse: FeedResponse<Stock> = await stockContainer.items.query(QUERY_ALL).fetchAll();
  const products = productQueryResponse.resources;
  const stocks = stockQueryResponse.resources;

  products.forEach((product: ProductDTO) => {
    const productStock = stocks.find((stock) => stock.product_id === product.id);
    product.count = productStock?.count ?? 0;
  });

  context.res = {
    body: products,
    status: 200,
  };
};

export default httpTrigger;
