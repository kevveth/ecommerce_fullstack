// Error content: message and optional context
export interface CustomErrorContent {
  message: string;
  context?: { [key: string]: any };
}

// Abstract class for custom errors
export abstract class CustomError extends Error {
  abstract readonly statusCode: number; // HTTP status code
  abstract readonly errors: CustomErrorContent[]; // Detailed error info
  abstract readonly logging: boolean; // Log this error?

  constructor(message: string) {
    super(message);

    // Ensures the prototype chain is set correctly for proper inheritance.
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
