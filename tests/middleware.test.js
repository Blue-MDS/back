const { checkToken } = require('../src/middlewares/authentication');
const { verify } = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('checkToken Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = () => {
      const req = {};
      req.header = jest.fn().mockReturnValue('fake_token');
      return req;
    };

    mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };

    nextFunction = jest.fn();
  });

  it('should call next() if token is valid', () => {
    verify.mockImplementation(() => ({ id: '123', user: 'test' }));
    const req = mockRequest();
    const res = mockResponse();

    checkToken(req, res, nextFunction);

    expect(req.header).toHaveBeenCalledWith('token');
    expect(verify).toHaveBeenCalledWith('fake_token', 'mysecretToken');
    expect(req.credentials).toEqual({ id: '123', user: 'test' });
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if no token is provided', () => {
    const req = mockRequest();
    req.header = jest.fn().mockReturnValue(undefined);
    const res = mockResponse();

    checkToken(req, res, nextFunction);

    expect(req.header).toHaveBeenCalledWith('token');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'not login' });
  });

  it('should handle errors if token is invalid', () => {
    verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const req = mockRequest();
    const res = mockResponse();

    checkToken(req, res, nextFunction);

    expect(req.header).toHaveBeenCalledWith('token');
    expect(verify).toHaveBeenCalledWith('fake_token', 'mysecretToken');
    expect(res.send).toHaveBeenCalledWith({ error: expect.any(Error) });
  });
});
