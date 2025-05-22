declare type HTTPMethodHandler = (request: Request, env?: any, ctx?: any) => Promise<Response> | Response;

declare type HTTPMethod = {
  /** Handler for HTTP GET requests */
  GET?: HTTPMethodHandler;
  /** Handler for HTTP POST requests */
  POST?: HTTPMethodHandler;
  /** Handler for HTTP OPTIONS requests */
  OPTIONS?: HTTPMethodHandler;
  /** Handler for HTTP HEAD requests */
  HEAD?: HTTPMethodHandler;
  /** Handler for HTTP DELETE requests */
  DELETE?: HTTPMethodHandler;
  /** Handler for HTTP PATCH requests */
  PATCH?: HTTPMethodHandler;
  /** Handler for HTTP PUT requests */
  PUT?: HTTPMethodHandler;
} | HTTPMethodHandler;

declare type BunRoutes = {
  [path: string]: HTTPMethod;
};

declare type ResponseHandler = (response: Response) => Promise<Response> | Response;

declare type RequestHandler = (request: Request, env?: any, ctx?: any) => Promise<Response> | Response | void;

/**
 * Middleware system for handling requests before they reach route handlers
 */
declare class BeforeRequest {
  private middlewareList: RequestHandler[];
  
  constructor();
  
  /**
   * Register a request middleware function
   * @param func Middleware function to add
   */
  use(func: RequestHandler): void;
  
  /**
   * Execute all registered request middlewares
   * @param request Incoming request
   * @param env Optional environment variables
   * @param ctx Optional context object
   * @returns Response if middleware chain was interrupted, otherwise null
   */
  execute(request: Request, env: any, ctx: any): Promise<Response | null>;
}

/**
 * Middleware system for handling responses before they are sent to clients
 */
declare class BeforeResponse {
  private middlewareList: ResponseHandler[];
  
  constructor();
  
  /**
   * Register a response middleware function
   * @param func Middleware function to add
   */
  use(func: ResponseHandler): void;
  
  /**
   * Execute all registered response middlewares
   * @param response Outgoing response
   * @returns Processed response
   */
  execute(response: Response): Promise<Response>;
}

/**
 * Apply middleware to route handlers
 * @param args Route definitions to wrap with middleware
 * @returns New route definitions with middleware applied
 */
declare function useMiddleware(...args: BunRoutes[]): BunRoutes;

/**
 * Group routes with a common prefix
 * @param prefix Prefix to prepend to all routes
 * @param args Route definitions to group
 * @returns New route definitions with prefix applied
 */
declare function useGroup(prefix?: string, ...args: BunRoutes[]): BunRoutes;

/**
 * Global request middleware instance
 */
declare const beforeRequest: BeforeRequest;

/**
 * Global response middleware instance
 */
declare const beforeRespose: BeforeResponse;

/**
 * Alias for useMiddleware
 */
declare const m: typeof useMiddleware;

/**
 * Alias for useGroup
 */
declare const g: typeof useGroup;

export {
  HTTPMethodHandler,
  HTTPMethod,
  BunRoutes,
  ResponseHandler,
  RequestHandler,
  BeforeRequest,
  BeforeResponse,
  useMiddleware,
  useGroup,
  beforeRequest,
  beforeRespose,
  m,
  g
};