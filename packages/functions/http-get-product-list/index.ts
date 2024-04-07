import { AzureFunction, Context } from '@azure/functions';
import { AppConfigurationClient } from '@azure/app-configuration';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const connectionString = process.env.AZURE_APP_CONFIG_CONNECTION_STRING;
  const client = new AppConfigurationClient(connectionString);
  const { value } = await client.getConfigurationSetting({ key: 'PRODUCTS_MOCK' });
  try {
    context.res = {
      status: 200,
      body: JSON.parse(value),
    };
  } catch (e) {
    context.log(e);
  }
};

export default httpTrigger;
