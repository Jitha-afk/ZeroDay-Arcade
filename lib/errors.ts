// Centralized error utilities & patterns
// Pattern: create typed error factories with discriminator codes

export type AppErrorCode =
  | 'UNEXPECTED'
  | 'NETWORK'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'VALIDATION';

export interface AppError extends Error {
  code: AppErrorCode;
  cause?: unknown;
  details?: Record<string, unknown>;
  status?: number;
}

function createError(code: AppErrorCode, message: string, options?: { cause?: unknown; details?: Record<string, unknown>; status?: number }): AppError {
  const err = new Error(message) as AppError;
  err.code = code;
  if (options?.cause) err.cause = options.cause;
  if (options?.details) err.details = options.details;
  if (options?.status) err.status = options.status;
  return err;
}

export const Errors = {
  unexpected: (message = 'An unexpected error occurred', options?: Parameters<typeof createError>[2]) =>
    createError('UNEXPECTED', message, options),
  network: (message = 'A network error occurred', options?: Parameters<typeof createError>[2]) =>
    createError('NETWORK', message, options),
  notFound: (resource: string, options?: Parameters<typeof createError>[2]) =>
    createError('NOT_FOUND', `${resource} not found`, options),
  unauthorized: (message = 'Unauthorized', options?: Parameters<typeof createError>[2]) =>
    createError('UNAUTHORIZED', message, options),
  validation: (field: string, message = 'Validation failed', options?: Parameters<typeof createError>[2]) =>
    createError('VALIDATION', `${message}: ${field}`, options),
};

export function isAppError(err: unknown): err is AppError {
  return typeof err === 'object' && err !== null && 'code' in err && 'message' in (err as any);
}

export function getErrorMessage(err: unknown): string {
  if (isAppError(err)) return err.message;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}
