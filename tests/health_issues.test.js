const { getHealthIssues } = require('../src/health_issues/controller');
const knex = require('../db/db');

jest.mock('../db/db');

describe('getHealthIssues', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should return health issues successfully', async () => {
    const req = {};
    const res = mockResponse();
    knex.from.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ health_issue: 'Issue1' }, { health_issue: 'Issue2' }])
    });

    await getHealthIssues(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ healthIssues: [{ health_issue: 'Issue1' }, { health_issue: 'Issue2' }] });
  });

  it('should return 200 if no health issues', async () => {
    const req = {};
    const res = mockResponse();
    knex.from.mockReturnValue({
      select: jest.fn().mockResolvedValue([])
    });

    await getHealthIssues(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ healthIssues: [] });
});

  it('should handle errors', async () => {
    const req = {};
    const res = mockResponse();
    knex.from.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('Database error'))
    });

    await getHealthIssues(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});
