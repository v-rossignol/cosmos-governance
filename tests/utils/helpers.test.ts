import axios from 'axios';
import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '@/utils/helpers';

describe('getErrorMessage', () => {
  it('returns a string message from a NestJS error response', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { message: 'Invalid credentials', statusCode: 401 },
      },
    );

    expect(getErrorMessage(error, 'Fallback')).toBe('Invalid credentials');
  });

  it('joins array messages from a NestJS error response', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { message: ['Username is required', 'Password is required'], statusCode: 400 },
      },
    );

    expect(getErrorMessage(error, 'Fallback')).toBe('Username is required, Password is required');
  });

  it('returns the Error message for generic errors', () => {
    expect(getErrorMessage(new Error('Something went wrong'), 'Fallback')).toBe(
      'Something went wrong',
    );
  });

  it('returns the fallback for unknown values', () => {
    expect(getErrorMessage('network down', 'Fallback')).toBe('Fallback');
    expect(getErrorMessage(null, 'Fallback')).toBe('Fallback');
  });
});
