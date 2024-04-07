import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { AppConfigurationClient } from '@azure/app-configuration';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const connectionString = process.env.AZURE_APP_CONFIG_CONNECTION_STRING;
  const client = new AppConfigurationClient(connectionString);
  const { value } = await client.getConfigurationSetting({ key: 'PRODUCTS_MOCK' });
  const { productId } = req.params;
  try {
    const product = JSON.parse(value).find(({ id }) => productId === id);
    context.res = {
      status: product ? 200 : 404,
      body: product,
    };
  } catch (e) {
    context.log(e);
  }
};

export default httpTrigger;
