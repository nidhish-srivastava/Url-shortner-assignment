const { getStats } = require('../controllers.js'); 
const UrlModel = require('../model.js'); 
const { mockResponse, mockRequest } = require('mock-req-res'); 
jest.mock('../model.js'); 

describe('getUrlStats Controller', () => {
    let req, res;

    beforeEach(() => {
        req = mockRequest(); 
        res = mockResponse(); 

        // Mock the response methods
        res.status = jest.fn().mockReturnValue(res);  // Mock status to return res
        res.json = jest.fn().mockReturnValue(res);     // Mock json to return res
    });

    it('should return clicks and lastAccessed for a valid shortId', async () => {
        const mockShortId = 'abc123';
        const mockUrlEntry = {
            shortId: mockShortId,
            clicks: 10,
            lastAccessed: '2024-11-25T12:00:00Z',
        };

        // Mock findOne to return a valid URL entry
        UrlModel.findOne = jest.fn().mockResolvedValue(mockUrlEntry);

        req.params.shortId = mockShortId;

        await getStats(req, res); // Call the controller function

        // Check if findOne was called with the correct parameters
        expect(UrlModel.findOne).toHaveBeenCalledWith({ shortId: mockShortId });

        // Check if the response was successful (status 200)
        expect(res.status).not.toHaveBeenCalledWith(404);  // Make sure 404 wasn't called
        expect(res.json).toHaveBeenCalledWith({
            clicks: mockUrlEntry.clicks,
            lastAccessed: mockUrlEntry.lastAccessed,
        });
    });

    it('should return 404 if the shortId is not found', async () => {
        const mockShortId = 'nonexistent123';

        // Mock findOne to return null (URL not found)
        UrlModel.findOne = jest.fn().mockResolvedValue(null);

        req.params.shortId = mockShortId;

        await getStats(req, res); // Call the controller function

        // Check if the response status is 404
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'URL not found' });
    });

    it('should return 500 if there is a server error', async () => {
        const mockShortId = 'abc123';

        // Simulate a server error by making findOne throw an error
        UrlModel.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

        req.params.shortId = mockShortId;

        await getStats(req, res); // Call the controller function

        // Check if the response status is 500
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
});