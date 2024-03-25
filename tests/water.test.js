const { 
  recordConsumption, 
  getTotalConsumption, 
  getAllConsumption, 
  createDailyGoal, 
  updateDailyGoal, 
  getDailyGoal,
  getDailyConsumption, 
  getWeeklyConsumption,
  getMonthlyConsumption,
 } = require('../src/water_consumptions/controller');
const WaterConsumption = require('../src/water_consumptions/model');
const calculateDailyGoal = require('../src/water_consumptions/utils');
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
        save: jest.fn().mockRejectedValue(new Error('Internal server error'))
      }));

      await recordConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
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
      WaterConsumption.getTotalConsumption.mockRejectedValue(new Error('Internal server error'));

      await getTotalConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
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
      WaterConsumption.getAllConsumption.mockRejectedValue(new Error('Internal server error'));

      await getAllConsumption(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
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
      User.findByEmail.mockRejectedValue(new Error('Internal server error'));

      await createDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
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

  describe('updateDailyGoal', () => {
    it('should update daily goal', async () => {
      const req = { 
        credentials: { userId: 1 },
        body: { newDailyGoal: 2000 }
      };
      const res = mockResponse();
      WaterConsumption.updateDailyGoal.mockResolvedValue({id: 1, userId: 1, dailyGoal: 2000});

      await updateDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ dailyGoalRecord: {id: 1, userId: 1, dailyGoal: 2000} });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { 
        credentials: { userId: 1 },
        body: { newDailyGoal: 2000 }
      };
      const res = mockResponse();
      WaterConsumption.updateDailyGoal.mockRejectedValue(new Error('Internal server error'));

      await updateDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getDailyGoal', () => {
    it('should return daily goal if it exists', async () => {
      const req = { credentials: { userId: 1 } };
      const res = mockResponse();
      WaterConsumption.getDailyGoal.mockResolvedValue([{ id: 1, userId: 1, dailyGoal: 2000 }]);

      await getDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, userId: 1, dailyGoal: 2000 }]);
  });

  it('should create and return daily goal if it does not exist', async () => {
      const req = { credentials: { userId: 1, email: 'toto@gmail.com' } };
      const res = mockResponse();
      WaterConsumption.getDailyGoal.mockResolvedValue([]);
      User.findByEmail.mockResolvedValue({ email: 'toto@gmail.com', weight: 70, physical_activity: 'actif' });
      WaterConsumption.saveDailyGoal.mockResolvedValue({ id: 2, userId: 1, dailyGoal: calculateDailyGoal({ weight: 70, physical_activity: 'actif' }) });

      await getDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(User.findByEmail).toHaveBeenCalledWith('toto@gmail.com');
      expect(WaterConsumption.saveDailyGoal).toHaveBeenCalled();
  });

  it('should return 404 if user not found for goal creation', async () => {
      const req = { credentials: { userId: 1, email: 'toto@gmail.com' } };
      const res = mockResponse();
      WaterConsumption.getDailyGoal.mockResolvedValue([]);
      User.findByEmail.mockResolvedValue(null);

      await getDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 500 if an error occurs', async () => {
      const req = { credentials: { userId: 1 } };
      const res = mockResponse();
      WaterConsumption.getDailyGoal.mockRejectedValue(new Error('Internal server error'));

      await getDailyGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

  describe('getDailyConsumption', () => {
    it('should return daily consumption data', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { specificDate: '2022-05-20' }
      };
      const res = mockResponse();
      WaterConsumption.getDailyConsumption.mockResolvedValue({ id: 1, userId: 1, quantity: 500, date: '2022-05-20' });
      await getDailyConsumption(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, quantity: 500, date: '2022-05-20' });
    });

    it('should return 404 if no consumption data for the date', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { specificDate: '2022-05-21' }
      };
      const res = mockResponse();
      WaterConsumption.getDailyConsumption.mockResolvedValue(null);
    
      await getDailyConsumption(req, res);
    
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aucune consommation pour cette date' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { specificDate: '2022-05-22' }
      };
      const res = mockResponse();
      WaterConsumption.getDailyConsumption.mockRejectedValue(new Error('Internal server error'));
    
      await getDailyConsumption(req, res);
    
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getWeeklyConsumption', () => {
    it('should return weekly consumption data', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { startDate: '2022-05-20', endDate: '2022-05-26' }
      };
      const res = mockResponse();
      WaterConsumption.getWeeklyConsumption.mockResolvedValue([{ id: 1, userId: 1, quantity: 500, date: '2022-05-20' }]);
      await getWeeklyConsumption(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, userId: 1, quantity: 500, date: '2022-05-20' }]);
    });

    it('should return 404 if no consumption data for the week', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { startDate: '2022-05-27', endDate: '2022-06-02' }
      };
      const res = mockResponse();
      WaterConsumption.getWeeklyConsumption.mockResolvedValue(null);
    
      await getWeeklyConsumption(req, res);
    
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aucune consommation pour cette semaine' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { startDate: '2022-06-03', endDate: '2022-06-09' }
      };
      const res = mockResponse();
      WaterConsumption.getWeeklyConsumption.mockRejectedValue(new Error('Internal server error'));
    
      await getWeeklyConsumption(req, res);
    
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getMonthlyConsumption', () => {
    it('should return monthly consumption data', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { specificMonth: '05', specificYear: '2022' }
      };
      const res = mockResponse();
      WaterConsumption.getMonthlyConsumption.mockResolvedValue([{ id: 1, userId: 1, quantity: 500, date: '2022-05-20' }]);
      await getMonthlyConsumption(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, userId: 1, quantity: 500, date: '2022-05-20' }]);
    });

    it('should return 404 if no consumption data for the month', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { specificMonth: '06', specificYear: '2022' }
      };
      const res = mockResponse();
      WaterConsumption.getMonthlyConsumption.mockResolvedValue(null);
    
      await getMonthlyConsumption(req, res);
    
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aucune consommation pour ce mois' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        credentials: { userId: 1 },
        query: { specificMonth: '07', specificYear: '2022' }
      };
      const res = mockResponse();
      WaterConsumption.getMonthlyConsumption.mockRejectedValue(new Error('Internal server error'));
    
      await getMonthlyConsumption(req, res);
    
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('calculateDailyGoal', () => {
    it('should calculate the correct daily goal for a sedentary user', () => {
      const user = { weight: 70, physical_activity: 'sédentaire' };
      const dailyGoal = calculateDailyGoal(user);
      expect(dailyGoal).toBe(2.45);
    });

    it('should calculate the correct daily goal for a moderately active user', () => {
      const user = { weight: 70, physical_activity: 'activité légère' };
      const dailyGoal = calculateDailyGoal(user);
      expect(dailyGoal).toBe(2.6);

    });

    it('should calculate the correct daily goal for an active user', () => {
      const user = { weight: 70, physical_activity: 'actif' };
      const dailyGoal = calculateDailyGoal(user);
      expect(dailyGoal).toBe(2.85);
    });

    it('should calculate the correct daily goal for a very active user', () => {
      const user = { weight: 70, physical_activity: 'très actif' };
      const dailyGoal = calculateDailyGoal(user);
      expect(dailyGoal).toBe(3.1);
    });
  });
});