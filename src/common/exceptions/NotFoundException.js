export class NotFoundException extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = 404;
  }
}
