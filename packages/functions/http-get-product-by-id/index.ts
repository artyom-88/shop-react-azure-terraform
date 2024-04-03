import { AzureFunction, Context, HttpRequest } from '@azure/functions';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

const productsMock: Product[] = [
  {
    id: 'C6B4471F-A4D5-45D9-B384-D82A064DB1F1',
    title: 'Product 1',
    description: 'The description of the product number one',
    price: 100,
  },
  {
    id: 'C6B4471F-A4D5-45D9-B384-D82A064DB1F2',
    title: 'Product 2',
    description: 'The description of the product number teo',
    price: 50,
  },
  {
    id: 'C6B4471F-A4D5-45D9-B384-D82A064DB1F3',
    title: 'Product 3',
    description: 'The description of the product number 3',
    price: 1000,
  },
];

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const { productId } = req.params;
  const product = productsMock.find(({ id }) => productId === id);
  context.res = {
    status: product ? 200 : 404,
    body: product,
  };
};

export default httpTrigger;
