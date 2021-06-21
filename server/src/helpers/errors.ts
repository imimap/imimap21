import { UnprocessableEntity } from "http-errors";

export class UnprocessableEntityError extends UnprocessableEntity {
  errors?: unknown[];

  constructor(options?: ErrorOptions) {
    if (!options) {
      super();
    } else {
      super(options.message);
      this.errors = options.errors;
    }
  }
}

interface ErrorOptions {
  message?: string;
  errors?: unknown[];
}
