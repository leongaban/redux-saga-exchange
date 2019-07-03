import { IRoutable, RouteTree, IQueryParams } from '../types/app';

interface IRawRouteTree {
  [routeKey: string]: IRawRouteTree | null;
}

// TODO watch for https://github.com/Microsoft/TypeScript/issues/10727 to fix any types
export function buildRouteTree<T extends IRawRouteTree>(rawTree: T): RouteTree<T> {
  return (function loop(tree: T, path: string[] = []): RouteTree<T> {
    return Object
      .keys(tree)
      .map(key => [key, tree[key]])
      .reduce<RouteTree<T>>((acc: RouteTree<T>, [key, value]: [string, T]) => {
        const xPath = [...path, key];

        const formattedPathElements = xPath;
        const formattedPath = `/${formattedPathElements.join('/')}`;

        const routeData: IRoutable = { getPath: makeGetPath(formattedPath), getElementKey: () => key };
        if (value === null) {
          return { ...(acc as any), [key]: routeData };
        }
        return {
          ...(acc as any),
          [key]: {
            ...(loop(value, xPath) as any),
            ...routeData,
          },
        };
      }, {} as RouteTree<T>);
  })(rawTree);
}

export const makeGetPath = (path: string) => (queryParams?: IQueryParams): string => {
  const params = queryParams ? `?${Object.entries(queryParams).map(x => x.join('=')).join('&')}` : '';
  return `${path}${params}`;
};
