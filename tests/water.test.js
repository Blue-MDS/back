const { recordConsumption, getTotalConsumption, getAllConsumption, createDailyGoal } = require('../src/water_consumptions/controller');
const WaterConsumption = require('../src/water_consumptions/model');
const User = require('../src/users/model');

jest.mock('../src/water_consumptions/model');
jest.mock('../src/users/model');

describe('WaterConsumptionController', () => {

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let req;
  let res;

  beforeEach(() => {
    req = {
      credentials: {
        userId: '123',
        email: 'toto@gmail.com',
      },
      body: {
        quantity: 200,
      },
    };
    res = mockResponse();
  });
  describe('recordConsumption', () => {
    it('should create a record and return 201 with message and record', async () => {
      const req = { 
        credentials: { userId: 1 },
        body: { quantity: 500 }
      };
      const res = mockResponse();
      WaterConsumption.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({id: 1, userId: 1, quantity: 500})
      }));

      await recordConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Recorded',
        newRecord: expect.any(Object)
      }));
    });

    it('should return 500 if an error occurs', async () => {
      const req = { 
        credentials: { userId: 1 },
        body: { quantity: 500 }
      };
      const res = mockResponse();
      WaterConsumption.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await recordConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  },);
  describe('getTotalConsumption', () => {
    it('should return total consumption', async () => {
      const req = { 
        credentials: { userId: 1 }
      };
      const res = mockResponse();
      WaterConsumption.getTotalConsumption.mockResolvedValue(1000);

      await getTotalConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ waterConsumptions: 1000 });
    });

    it('should return 200 if no records', async () => {
      const req = { 
        credentials: { userId: 1 }
      };
      const res = mockResponse();
      WaterConsumption.getTotalConsumption.mockResolvedValue(null);

      await getTotalConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ waterConsumptions: 0 });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { 
        credentials: { userId: 1 }
      };
      const res = mockResponse();
      WaterConsumption.getTotalConsumption.mockRejectedValue(new Error('Database error'));

      await getTotalConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getAllConsumption', () => {
    it('should return all consumption', async () => {
      const req = { 
        credentials: { userId: 1 }
      };
      const res = mockResponse();
      WaterConsumption.getAllConsumption.mockResolvedValue([{id: 1, userId: 1, quantity: 500}]);

      await getAllConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ waterConsumptions: [{id: 1, userId: 1, quantity: 500}] });
    });

    it('should return 404 if no records', async () => {
      const req = { 
        credentials: { userId: 1 }
      };
      const res = mockResponse();
      WaterConsumption.getAllConsumption.mockResolvedValue(null);

      await getAllConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No records' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { 
        credentials: { userId: 1 }
      };
      const res = mockResponse();
      WaterConsumption.getAllConsumption.mockRejectedValue(new Error('Database error'));

      await getAllConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('createDailyGoal', () => {
    it('should create a daily goal', async () => {
      const req = { 
        credentials: { userId: 1, email: 'toto@gmail.com' }
      };
      const res = mockResponse();
      User.findByEmail.mockResolvedValue({id: 1});
      WaterConsumption.saveDailyGoal.mockResolvedValue({id: 1, userId: 1, dailyGoal: 2000});

      await createDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ dailyGoalRecord: {id: 1, userId: 1, dailyGoal: 2000} });
    });

    it('should return 404 if no user', async () => {
      const req = { 
        credentials: { userId: 1, email: 'toto@gmail.com' }
      };
      const res = mockResponse();
      User.findByEmail.mockResolvedValue(null);

      await createDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { 
        credentials: { userId: 1, email: 'toto@gmail.com' }
      };
      const res = mockResponse();
      User.findByEmail.mockRejectedValue(new Error('Database error'));

      await createDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });

    it('should return 404 if daily goal not created', async () => {
      const req = { 
        credentials: { userId: 1, email: 'toto@gmail.com' }
      };
      const res = mockResponse();
      User.findByEmail.mockResolvedValue({id: 1});
      WaterConsumption.saveDailyGoal.mockResolvedValue(null);

      await createDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Daily goal not created' });
    });
  });
});