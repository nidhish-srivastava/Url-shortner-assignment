const { redirectUrl } = require('../controllers.js'); 
const UrlModel = require('../model.js'); 
const { mockResponse, mockRequest } = require('mock-req-res'); // For mocking express req and res
jest.mock('../model.js'); // Mock the model

describe('redirectUrl Controller', () => {
    let req, res;

    beforeEach(() => {
        req = mockRequest(); // Mock the request
        res = mockResponse(); // Mock the response

        // Mock the response methods
        res.status = jest.fn().mockReturnValue(res);  // Mock status to return res
        res.json = jest.fn().mockReturnValue(res);     // Mock json to return res
        res.redirect = jest.fn();  // Mock redirect
    });

    it('should redirect to the original URL for a valid shortId and increment clicks', async () => {
        const mockShortId = 'abc123';
        const mockOriginalUrl = 'https://example.com';
        const mockUrlEntry = {
            originalUrl: mockOriginalUrl,
            shortId: mockShortId,
            clicks: 5,
            lastAccessed: null,
            save: jest.fn().mockResolvedValue() // Mock save to resolve successfully
        };

        // Mock findOne to return the mock URL entry
        UrlModel.findOne = jest.fn().mockResolvedValue(mockUrlEntry);

        req.params.shortId = mockShortId;

        await redirectUrl(req, res); // Call the controller function

        // Check if findOne was called with the correct parameters
        expect(UrlModel.findOne).toHaveBeenCalledWith({ shortId: mockShortId });

        // Check if the response was a redirect
        expect(res.redirect).toHaveBeenCalledWith(mockOriginalUrl);

        // Ensure that the clicks were incremented and the save method was called
        expect(mockUrlEntry.clicks).toBe(6); // Clicks should have been incremented by 1
        expect(mockUrlEntry.save).toHaveBeenCalled();
    });

    it('should return 404 if the shortId is not found', async () => {
        const mockShortId = 'nonexistent123';

        // Mock findOne to return null (i.e., no entry found)
        UrlModel.findOne = jest.fn().mockResolvedValue(null);

        req.params.shortId = mockShortId;

        await redirectUrl(req, res);

        // Check if the response status is 404
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'URL not found' });
    });

    it('should return 500 if there is a server error', async () => {
        const mockShortId = 'abc123';

        // Simulate a server error by making findOne throw an error
        UrlModel.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

        req.params.shortId = mockShortId;

        await redirectUrl(req, res);

        // Check if the response status is 500
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
});
