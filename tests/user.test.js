const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../src/users/model');
const EmailVerification = require('../src/email_verification/model');
const { createUser, getUser, login, updateUser, deleteUser } = require('../src/users/controller');

jest.mock('../src/users/model');
jest.mock('../src/email_verification/model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
beforeEach(() => {
  jest.clearAllMocks();
});

describe('createUser', () => {
  const req = {
    body: {
      email: 'emailtest@gmail.com',
      code: '1234',
      password: 'password',
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  it('should return 400 if user already exists', async () => {
    User.findByEmail.mockResolvedValue({ email: 'emailtest@gmail.com' });
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'A user with this email already exist' });
  });

  it('should return 500 if code is invalid', async () => {
    User.findByEmail.mockResolvedValue(null);
    EmailVerification.findCode.mockResolvedValue(null);
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid code' });
  });

  it('should return 410 if code is expired', async () => {
    User.findByEmail.mockResolvedValue(null);
    const fiveMinutesAndOneSecondAgo = new Date(Date.now() - (5 * 60 * 1000 + 1000));
    EmailVerification.findCode.mockResolvedValue({ updated_at: fiveMinutesAndOneSecondAgo });
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(410);
    expect(res.json).toHaveBeenCalledWith({ message: 'Verification code has expired. Please request a new one.' });
  });

  it('should return 201 if user is created', async () => {
    User.findByEmail.mockResolvedValue(null);
    EmailVerification.findCode.mockResolvedValue({ updated_at: new Date() });
    bcrypt.hash.mockImplementation((_, __, callback) => callback(null, 'hashedPassword'));
    jwt.sign.mockReturnValue('token');
    const mockUserInstance = { save: jest.fn().mockResolvedValue({ email: 'emailtest@gmail.com', id: 1 }) };
    User.mockImplementation(() => mockUserInstance);

    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created!',
      user: { email: 'emailtest@gmail.com', id: 1 },
      token: 'token'
    });
  });
});

describe('getUser', () => {
  const req = {
    credentials: { email: 'emailtoto@gmail.com' },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  it('should return 400 if user does not exist', async () => {
    User.findByEmail.mockResolvedValue(null);
    await getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User doesn\'t exist' });
  });

  it('should return 200 if user exists', async () => {
    User.findByEmail.mockResolvedValue({ email: 'emailtoto@gmail.com', id: 1 });
    await getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ email: 'emailtoto@gmail.com', id: 1 });
  });
});

describe('login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'emailtoto@gmail.com',
        password: 'password',
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should return 400 if user does not exist', async () => {
    User.findByEmail.mockResolvedValue(null);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User does not exist' });
  });

  it('should return 400 if password is incorrect', async () => {
    req.body.password = 'wrongPassword';

    User.findByEmail.mockResolvedValue({ email: 'emailtoto@gmail.com', password: 'hashedPasswordCorrect' });
    bcrypt.compare.mockImplementation((providedPassword, storedPassword, callback) => {
      callback(null, providedPassword === 'correctPassword' && storedPassword === 'hashedPasswordCorrect');
    });

    await login(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password incorrect' });
  });

  it('should return 200 if user is logged', async () => {
    req.body.password = 'correctPassword';

    User.findByEmail.mockResolvedValue({ email: 'emailtoto@gmail.com', id: 1, password: 'hashedPasswordCorrect' });
    bcrypt.compare.mockImplementation((providedPassword, storedPassword, callback) => {
      callback(null, providedPassword === 'correctPassword' && storedPassword === 'hashedPasswordCorrect');
    });
    jwt.sign.mockReturnValue('token');

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User logged !',
      token: 'token',
      user: { email: 'emailtoto@gmail.com', id: 1, password: 'hashedPasswordCorrect' }
    });
  });
});


describe('updateUser', () => {
  const req = {
    credentials: { userId: 1, email: 'toto@gmail.com' },
    body: {
      email: 'toto@gmail.com',
      password: 'password',
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  it('should return 400 if user does not exist', async () => {
    User.findByEmail.mockResolvedValue(null);
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User doesn\'t exist' });
  });

  it('should return 200 if user is updated', async () => {
    User.findByEmail.mockResolvedValue({ email: 'toto@gmail.com' });
    User.update.mockResolvedValue(true);
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User updated !', user: { email: 'toto@gmail.com' } });
  });
});

describe('deleteUser', () => {
  const req = {
    credentials: { email: 'toto@gmail.com' },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  it('should return 400 if user does not exist', async () => {
    User.findByEmail.mockResolvedValue(null);
    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User doesn\'t exist' });
  });

  it('should return 200 if user is deleted', async () => {
    User.findByEmail.mockResolvedValue({ email: 'toto@gmail.com' });
    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
  });
});
