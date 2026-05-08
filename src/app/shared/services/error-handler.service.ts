import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('[GlobalError]', error);
  }
}
