import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createDbClient, DB_ID, PRODUCTS_CONTAINER_ID, STOCK_CONTAINER_ID } from '../common';
import { ItemResponse } from '@azure/cosmos';
import { Product, Stock } from '../types';
import { v4 } from 'uuid';

const getError = (context: Context, body: Partial<Product>): string => {
  context.log(`Validate body ${JSON.stringify(body, null, 1)}`);
  const fields = Object.keys(body);
  if (fields.length > 3) {
    return 'The body can contain only "description", "price" and "title" fields';
  }
  if (!fields.includes('description')) {
    return 'Description is required';
  }
  if (!fields.includes('price')) {
    return 'Price is required';
  }
  if (!fields.includes('title')) {
    return 'Title is required';
  }
  if (!body.description.toString().trim()) {
    return 'Invalid description';
  }
  if (!body.title.toString().trim()) {
    return 'Invalid title';
  }
  const price = parseFloat(body.price as unknown as string);
  if (isNaN(price) || price <= 0) {
    return 'Invalid price';
  }
  return '';
};

const createProduct = async (context: Context, dto: Product) => {
  const dbClient = await createDbClient(context);
  const productContainer = dbClient.database(DB_ID).container(PRODUCTS_CONTAINER_ID);
  context.log(`Create product ${JSON.stringify(dto, null, 1)}`);
  const { resource: product }: ItemResponse<Product> = await productContainer.items.create(dto);
  const stockContainer = dbClient.database(DB_ID).container(STOCK_CONTAINER_ID);
  const { resource: stock }: ItemResponse<Stock> = await stockContainer.items.create({
    product_id: dto.id,
    count: 0,
  });
  return {
    ...product,
    count: stock.count,
  };
};

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Post product triggered');
  const { body } = req;
  const error = getError(context, body);
  if (error) {
    context.res = {
      body: { error },
      status: 400,
    };
    return;
  }

  const product = await createProduct(context, { ...body, id: v4() });
  context.res = {
    body: product,
    status: 200,
  };
};

export default httpTrigger;
