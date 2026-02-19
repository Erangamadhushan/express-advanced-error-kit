export interface ErrorMiddlewareOptions {
  logger?: (error: any) => void;
  showStack?: boolean;
}
