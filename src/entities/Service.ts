export type ServiceResponse<T = undefined> = {
  status : true;
  data?: T;
  err?: ServiceError
} | {
  status: false;
  err?: ServiceError;
}

interface ServiceError {
  message: string;
  code: number;
}

export const INTERNAL_SERVER_ERROR_SERVICE_RESPONSE: ServiceResponse = {
  status: false,
  err: {
    message: "Internal Server Error",
    code: 500
  }
}

export const INVALID_ID_SERVICE_RESPONSE: ServiceResponse = {
  status: false,
  err: {
    message: "Invalid ID, Data not Found",
    code: 404
  }
}

export const UNAUTHORIZED_RESPONSE: ServiceResponse = {
  status: false,
  err: {
    message: "UNAUHTORIZED",
    code: 401
  }
}

export function BadRequestWithMessage(message: string): ServiceResponse {
  return {
    status: false,
    err: {
      message,
      code: 400
    }
  }
}