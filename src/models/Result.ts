import AppError from '../errors/AppError';

export default class Result<T> {
  onSuccess?: T;

  onError?: AppError;

  constructor(type?: T, error?: AppError) {
    this.onSuccess = type;
    this.onError = error;
  }
}
