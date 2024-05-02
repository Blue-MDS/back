const { savePreferences } = require('../src/notifications/controller');
const Notification = require('../src/notifications/model');
const { scheduleOrUpdateNotificationForUser } = require('../src/notifications/service');
const knex = require('../db/db');

jest.mock('../src/notifications/model');
jest.mock('../src/notifications/service');
jest.mock('../db/db');

describe('Notification controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      credentials: {
        userId: 1,
      },
      body: {
        expoToken: 'ExponentPushToken[7Y83a8BAbF8seHZbnZ1KVT]',
        startTime: '2021-09-01T09:00:00.000Z',
        endTime: '2021-09-01T23:00:00.000Z',
        frequency: 1,
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('savePreferences', () => {
    it('should save notification preferences and schedule notification', async () => {
      const notification = new Notification({
        userId: 1,
        endTime: '2021-09-01T23:00:00.000Z',
        startTime: '2021-09-01T09:00:00.000Z',
        frequency: 1,
        expoToken: 'ExponentPushToken[7Y83a8BAbF8seHZbnZ1KVT]',
      });
      Notification.mockReturnValue(notification);

      await savePreferences(req, res);

      expect(Notification).toHaveBeenCalledWith({
        userId: 1,
        endTime: '2021-09-01T23:00:00.000Z',
        startTime: '2021-09-01T09:00:00.000Z',
        frequency: 1,
        expoToken: 'ExponentPushToken[7Y83a8BAbF8seHZbnZ1KVT]',
      });
      expect(notification.saveOrUpdate).toHaveBeenCalled();
      expect(scheduleOrUpdateNotificationForUser).toHaveBeenCalledWith(1, 'ExponentPushToken[7Y83a8BAbF8seHZbnZ1KVT]', '2021-09-01T09:00:00.000Z', '2021-09-01T23:00:00.000Z', 1, 'C\'est l\'heure de votre nnotification !');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notification preferences saved and scheduled!' });
    });

    it('should return 500 if an error occurs', async () => {
      const error = new Error('Something went wrong');
      Notification.mockImplementation(() => {
        throw error;
      });

      await savePreferences(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
