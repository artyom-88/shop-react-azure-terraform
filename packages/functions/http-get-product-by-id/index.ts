import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createDbClient, DB_ID, PRODUCTS_CONTAINER_ID, QUERY_ALL, STOCK_CONTAINER_ID } from '../common';
import { FeedResponse } from '@azure/cosmos';
import { Product, Stock } from '../types';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const dbClient = await createDbClient(context);
  const productContainer = dbClient.database(DB_ID).container(PRODUCTS_CONTAINER_ID);
  const { productId } = req.params;
  context.log(`Get product ${productId}`);
  const query = { query: `SELECT * FROM c where c.id='${productId}'` };
  const productQueryResponse: FeedResponse<Product> = await productContainer.items.query(query).fetchAll();
  const product = productQueryResponse.resources[0];
  if (!product) {
    context.res = { status: 404 };
    context.log('Not found');
    return;
  }

  const stockContainer = dbClient.database(DB_ID).container(STOCK_CONTAINER_ID);
  const stockQueryResponse: FeedResponse<Stock> = await stockContainer.items.query(QUERY_ALL).fetchAll();
  const stocks = stockQueryResponse.resources;
  const productStock = stocks.find((stock) => stock.product_id === product.id);

  const body = {
    ...product,
    count: productStock?.count ?? 0,
  };

  context.log(`Product found: ${JSON.stringify(body, null, 1)}`);

  context.res = {
    body: body,
    status: 200,
  };
};

export default httpTrigger;
