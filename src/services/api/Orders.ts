import { bind } from 'decko';

import BaseApi from './Base';
import { IArchiveOrder, IPagedArchiveOrders, IPaginatedData, IActiveOrder } from 'shared/types/models';
import { convertToArchiveOrder, convertToActiveOrder  } from 'shared/helpers/converters';

import * as requests from 'shared/types/requests';
import { archiveOrdersServerColumns } from 'shared/constants';
import * as converters from './converters';
import { IPlaceOrdersResponse, IOrderHistoryServerResponse, IOpenOrdersResponse } from './types';
import { convertPaginatedData, convertPagingRequest, convertSortingRequest } from './converters/helpers';

class OrdersApi extends BaseApi {

  @bind
  public async cancelOrder(id: number): Promise<void> {
    await this.actions.del(`/frontoffice/api/orders/${id}`, {}, {}, {});
  }

  @bind
  public async loadArchiveOfOrders(): Promise<IArchiveOrder[]> {
    const response = await this.actions.get<IOrderHistoryServerResponse>('/frontoffice/api/order_history');
    const archiveOrders: IArchiveOrder[] = response.data.data.map(convertToArchiveOrder);
    return archiveOrders;
  }

  @bind
  public async loadPagedArchiveOfOrders(
    request: requests.ILoadFilteredArchiveOrdersRequest,
  ): Promise<IPagedArchiveOrders> {
    const response = await this.actions.get<IOrderHistoryServerResponse>(
      `/frontoffice/api/order_history`,
      {
        ...convertPagingRequest(request),
        ...convertSortingRequest(request.sort, archiveOrdersServerColumns),
        ...converters.convertArchiveOrdersFilters(request.filters),
      }
    );

    return {
      data: response.data.data.map(convertToArchiveOrder),
      totalPages: response.data.paging.page,
    };
  }

  @bind
  public async loadPagedArchiveOfOrdersForUser(
    request: requests.ILoadUserArchiveOrdersRequest,
  ): Promise<IPaginatedData<IArchiveOrder[]>> {
    const response = await this.actions.get<IOrderHistoryServerResponse>(
      `/back-api/backoffice/user/${request.userID}/order-history`,
      {
        ...convertPagingRequest(request),
        ...convertSortingRequest(request.sort, archiveOrdersServerColumns),
        ...converters.convertArchiveOrdersFilters(request.filters),
      }
    );
    const { data: orders, paging } = response.data;
    return convertPaginatedData(
      orders.map(convertToArchiveOrder),
      paging,
    );
  }

  @bind
  public async placeOrder(request: requests.IPlaceOrderRequest) {
    await this.actions.post<IPlaceOrdersResponse>(
      '/frontoffice/api/order',
      converters.convertPlaceOrderRequest(request),
    );
  }

  @bind
  public async loadUserOpenOrders(
    request: requests.ILoadUserArchiveOrdersRequest,
  ): Promise<IPaginatedData<IActiveOrder[]>> {
    const { userID } = request;
    const response = await this.actions.get<IOpenOrdersResponse>(
      `/back-api/backoffice/user/${userID}/orders`,
      { Status: 'working', ...convertPagingRequest(request) },
    );
    const { data: orders, paging } = response.data;
    return convertPaginatedData(
      orders.map(convertToActiveOrder),
      paging,
    );
  }
}

export default OrdersApi;
