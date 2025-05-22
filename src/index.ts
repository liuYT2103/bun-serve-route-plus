type HTTPMethodHandler = (request: Request, env?:any, ctx?:any) => Promise<Response> | Response;
type HTTPMethod = {
  GET?: HTTPMethodHandler;
  POST?: HTTPMethodHandler;
  OPTIONS?: HTTPMethodHandler;
  HEAD?: HTTPMethodHandler;
  DELETE?: HTTPMethodHandler;
  PATCH?: HTTPMethodHandler;
  PUT?: HTTPMethodHandler;
} | HTTPMethodHandler;
export type BunRoutes = {
  [x: string]: HTTPMethod;
};
type ResponseHandler = (response:Response) => Promise<Response> | Response
type RequestHandler = (request:Request, env?:any, ctx?:any) => Promise<Response> | Response | void

class BeforeRequest {
  private middlewareList: RequestHandler[];
  constructor() {
    this.middlewareList = [];
  }
  use(func: RequestHandler) {
    this.middlewareList.push(func);
  }
  async execute(request: Request, env: any, ctx: any): Promise<Response | null> {
    for (const middleware of this.middlewareList) {
      const result = await middleware(request, env, ctx);
      if (result instanceof Response) {
        return result; 
      }
    }
    return null;
  }
} 
class BeforeResponse {
  private middlewareList: ResponseHandler[];
  constructor() {
    this.middlewareList = [];
  }
  use(func: ResponseHandler) {
    this.middlewareList.push(func);
  }
  async execute(response: Response): Promise<Response> {
    for (const middleware of this.middlewareList) {
      response = await middleware(response);
    }
    return response;
  }
}
export const useMiddleware = (...args:BunRoutes[]):BunRoutes => {
  const excu = (func:HTTPMethodHandler) => async (request: Request, env: any, ctx: any) => {
    const requestMiddlewareResponse = await beforeRequest.execute(request, env, ctx);
    if (requestMiddlewareResponse) {
      return requestMiddlewareResponse;
    }
    const response = await func(request, env, ctx);
    return await beforeRespose.execute(response)
  }
  const handleMethods = (methods: HTTPMethod):HTTPMethod => 
    typeof methods == 'function' ? 
    excu(methods) : 
    Object.fromEntries(
      Object.entries(methods)
        .filter(([_method, handler]) => !!handler)
        .concat([['OPTIONS', () => new Response()]])
        .map(([method, handler]) => [method,excu(handler!)])
    )
  
  const BunRoutesr:BunRoutes = Object.assign({}, ...args)
  return Object.fromEntries(
    Object.entries(BunRoutesr).map(([route, methods]) => [route, handleMethods(methods)])
  )
}
export const useGroup = (prefix:string = '', ...args: BunRoutes[] ) => {
  const routes:BunRoutes = Object.assign({}, ...args)
  return Object.fromEntries(
    Object.entries(routes).map(([route, methods]) => [('/'+ prefix + route).replace('//','/'), methods])
  )
}
export const beforeRequest =  new BeforeRequest()
export const beforeRespose =  new BeforeResponse()
export const m = useMiddleware
export const g = useGroup