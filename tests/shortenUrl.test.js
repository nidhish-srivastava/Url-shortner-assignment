const { shortenUrl } = require('../controllers.js');  
const UrlModel = require('../model.js'); 
const { mockResponse, mockRequest } = require('mock-req-res'); 
const shortId = require('shortid'); 
const { isValidUrl } = require('../utils'); 
jest.mock('../model.js'); 
jest.mock('shortid'); 
jest.mock('../utils'); 

describe('shortenUrl Controller', () => {
    let req, res;

    beforeEach(() => {
        req = mockRequest(); // Mock the request
        res = mockResponse(); // Mock the response

        // Mock the response methods
        res.status = jest.fn().mockReturnValue(res);  // Mock status to return res
        res.json = jest.fn().mockReturnValue(res);     // Mock json to return res

        // Mock `req.protocol` and `req.get('host')` to simulate the values
        req.protocol = 'http'; // Mock the protocol (http or https)
        req.get = jest.fn().mockReturnValue('localhost'); // Mock the host (e.g., localhost)
    });

    it('should return a shortened URL for a valid URL', async () => {
        const mockUrl = 'https://example.com';
        const mockShortUrl = 'abc123';
        
        // Mock isValidUrl to return true for valid URL
        isValidUrl.mockReturnValue(true);
        
        // Mock shortId.generate to return a predefined short URL
        shortId.generate.mockReturnValue(mockShortUrl);

        // Mock the save method on UrlModel
        const mockSave = jest.fn().mockResolvedValue();
        UrlModel.prototype.save = mockSave;

        req.body.url = mockUrl;  // Set the URL in the request body

        await shortenUrl(req, res); // Call the controller function

        // Check if shortId.generate was called
        expect(shortId.generate).toHaveBeenCalled();

        // Check if the response is correct
        expect(res.json).toHaveBeenCalledWith({
            shortUrl: `http://localhost/${mockShortUrl}`,
        });

        // Ensure that the save method was called
        expect(mockSave).toHaveBeenCalled();
    });

    it('should return 400 if the URL is invalid', async () => {
        const invalidUrl = 'invalid-url';
        
        // Mock isValidUrl to return false for invalid URL
        isValidUrl.mockReturnValue(false);

        req.body.url = invalidUrl;  // Set the invalid URL in the request body

        await shortenUrl(req, res); // Call the controller function

        // Check if the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid URL' });
    });

    it('should return 400 if the URL is missing', async () => {
        req.body.url = ''; // Simulate missing URL

        await shortenUrl(req, res); // Call the controller function

        // Check if the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid URL' });
    });

    it('should return 500 if there is a server error', async () => {
        const mockUrl = 'https://example.com';

        // Mock isValidUrl to return true
        isValidUrl.mockReturnValue(true);

        // Mock shortId.generate to return a predefined short URL
        shortId.generate.mockReturnValue('abc123');

        // Simulate a server error by making save throw an error
        const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
        UrlModel.prototype.save = mockSave;

        req.body.url = mockUrl; // Set the URL in the request body

        await shortenUrl(req, res); // Call the controller function

        // Check if the response status is 500
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
});
