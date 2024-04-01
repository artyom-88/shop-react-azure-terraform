import { http, HttpResponse } from 'msw';
import API_PATHS from '~/constants/apiPaths';
import { availableProducts, cart, orders, products } from '~/mocks/data';
import { CartItem } from '~/models/CartItem';
import { Order } from '~/models/Order';
import { AvailableProduct, Product } from '~/models/Product';

export const handlers = [
  http.get(`${API_PATHS.bff}/product`, () => {
    return HttpResponse.json<Product[]>(products, { status: 200 });
  }),
  http.put(`${API_PATHS.bff}/product`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.delete(`${API_PATHS.bff}/product/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.get(`${API_PATHS.bff}/product/available`, () => {
    return HttpResponse.json<AvailableProduct[]>(availableProducts, { status: 200 });
  }),
  http.get(`${API_PATHS.bff}/product/:id`, ({ params }) => {
    const product = availableProducts.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json<AvailableProduct>(null, { status: 404 });
    }
    return HttpResponse.json<AvailableProduct>(product, { status: 200 });
  }),
  http.get(`${API_PATHS.cart}/profile/cart`, () => {
    return HttpResponse.json<CartItem[]>(cart, { status: 200 });
  }),
  http.put(`${API_PATHS.cart}/profile/cart`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.get(`${API_PATHS.order}/order`, () => {
    return HttpResponse.json<Order[]>(orders, { status: 200 });
  }),
  http.put(`${API_PATHS.order}/order`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.get(`${API_PATHS.order}/order/:id`, ({ params }) => {
    const order = orders.find((p) => p.id === params.id);
    if (!order) {
      return HttpResponse.json(null, { status: 404 });
    }
    return HttpResponse.json<Order>(order, { status: 200 });
  }),
  http.delete(`${API_PATHS.order}/order/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.put(`${API_PATHS.order}/order/:id/status`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
];
