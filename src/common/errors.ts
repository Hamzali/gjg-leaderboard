/**
 * Error definitions for the application
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export const userNotFound = (userId: string) => {
  throw new HttpException(
    `user with ${userId} is not found.`,
    HttpStatus.NOT_FOUND,
  );
};

export const invalidDisplayName = (name: string) => {
  throw new HttpException(
    `${name} display name is invalid.`,
    HttpStatus.BAD_REQUEST,
  );
};

export const invalidCountryCode = (code: string) => {
  throw new HttpException(
    `${name} code is not a invalid country code.`,
    HttpStatus.BAD_REQUEST,
  );
};

export const invalidObjectId = () => {
  throw new HttpException('invalid object id.', HttpStatus.BAD_REQUEST);
};

export const invalidScore = () => {
  throw new HttpException(
    'Invalid score it must be higher than 0',
    HttpStatus.BAD_REQUEST,
  );
};
