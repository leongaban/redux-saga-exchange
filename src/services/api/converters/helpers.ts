import {
  IPaginatedData, IServerPaging, IPagedRequest,
  IServerPagedRequest, ISortInfoRequest,
} from 'shared/types/models';

export function getRequiredProperty<T>(
  property: T | undefined, defaultValue: T, propertyName: string, context: string,
) {

  if (property !== undefined) {
    return property;
  }
  console.warn(`${context}: Unexpected undefined property ${propertyName}`);
  return defaultValue;
}

export function convertPaginatedData<T>(data: T, paging: IServerPaging): IPaginatedData<T> {
  return {
    data,
    pagination: {
      page: paging.page,
      total: paging.total,
      perPage: paging.per_page,
    },
  };
}

export function convertPagingRequest(request: IPagedRequest): IServerPagedRequest {
  return {
    Page: request.page,
    PerPage: request.perPage,
  };
}

export function convertSortingRequest<S>(
  { column, direction }: ISortInfoRequest<S>,
  serverColumns: Partial<Record<keyof S, string>>,
) {
  const AscOrder = (() => {
    if (direction === 'ascend') {
      return [serverColumns[column]];
    }
  })();
  const DescOrder = (() => {
    if (direction === 'descend') {
      return [serverColumns[column]];
    }
  })();
  return {
    AscOrder,
    DescOrder,
  };
}
