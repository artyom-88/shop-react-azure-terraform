import { AzureFunction, Context } from '@azure/functions';
import { createDbClient, DB_ID, PRODUCTS_CONTAINER_ID } from '../common';
import { FeedResponse } from '@azure/cosmos';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
  context.log('Get total triggered');
  const dbClient = await createDbClient(context);
  const productContainer = dbClient.database(DB_ID).container(PRODUCTS_CONTAINER_ID);
  const query = { query: 'SELECT VALUE COUNT(c.id) FROM c' };
  const productQueryResponse: FeedResponse<number> = await productContainer.items.query(query).fetchAll();
  const response = productQueryResponse.resources;
  const total = response[0];
  context.log(`Total count is ${total}`);
  context.res = {
    body: total,
    status: 200,
  };
};

export default httpTrigger;
