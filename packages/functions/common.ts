import { Context } from '@azure/functions';
import { CosmosClient } from '@azure/cosmos';
import { AppConfigurationClient } from '@azure/app-configuration';

export const DB_ID = 'products-db';

export const PRODUCTS_CONTAINER_ID = 'products';

export const STOCK_CONTAINER_ID = 'stock';

export const QUERY_ALL = { query: 'SELECT * FROM c' };

export const createDbClient = async (context: Context): Promise<CosmosClient> => {
  const connectionString = process.env.AZURE_APP_CONFIG_CONNECTION_STRING;
  const configurationClient = new AppConfigurationClient(connectionString);
  const { value: endpoint } = await configurationClient.getConfigurationSetting({ key: 'COSMOS_ENDPOINT' });
  const { value: key } = await configurationClient.getConfigurationSetting({ key: 'COSMOS_KEY' });
  const client = new CosmosClient({ endpoint, key });
  context.log('DB client created.');
  return client;
};
