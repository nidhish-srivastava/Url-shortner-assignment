const UrlModel = require("./model.js");
const shortId = require("shortid");

function isValidUrl(url) {
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
}

const shortenUrl = async (req, res) => {
    //  #swagger.tags = ['URL Shortener']
    //  #swagger.description = 'Endpoint to shorten a URL'
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'URL to be shortened',
            required: true,
            schema: {
                type: 'object',
                properties: {
                    url: { type: 'string', example: 'https://example.com' }
                }
            }
        }
    */
    /*  #swagger.responses[200] = {
            description: 'Shortened URL',
            schema: {
                type: 'object',
                properties: {
                    shortUrl: { type: 'string', example: 'http://localhost:3000/abc123' }
                }
            }
        }
    */
    /*  #swagger.responses[400] = {
            description: 'Invalid URL',
            schema: { type: 'object', properties: { error: { type: 'string', example: 'Invalid URL' } } }
        }
    */
    /*  #swagger.responses[500] = {
            description: 'Server error',
            schema: { type: 'object', properties: { error: { type: 'string', example: 'Server error' } } }
        }
    */
    try {
        const { url } = req.body;
        if (!url || !isValidUrl(url)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }
        const shortUrl = shortId.generate();
        const newUrl = new UrlModel({
            originalUrl: url,
            shortId: shortUrl,
        });
        await newUrl.save();
        res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const redirectUrl = async (req, res) => {
    //  #swagger.tags = ['URL Shortener']
    //  #swagger.description = 'Endpoint to redirect to the original URL'
    /*  #swagger.parameters['shortId'] = {
            in: 'path',
            description: 'Shortened URL ID',
            required: true,
            type: 'string',
            example: 'abc123'
        }
    */
    /*  #swagger.responses[302] = {
            description: 'Redirecting to the original URL',
        }
    */
    /*  #swagger.responses[404] = {
            description: 'URL not found',
            schema: { type: 'object', properties: { error: { type: 'string', example: 'URL not found' } } }
        }
    */
    /*  #swagger.responses[500] = {
            description: 'Server error',
            schema: { type: 'object', properties: { error: { type: 'string', example: 'Server error' } } }
        }
    */
    try {
        const { shortId } = req.params;
        const urlEntry = await UrlModel.findOne({ shortId });
        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }
        urlEntry.clicks += 1;
        urlEntry.lastAccessed = new Date();
        await urlEntry.save();
        res.redirect(urlEntry.originalUrl);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const getStats = async (req, res) => {
    //  #swagger.tags = ['URL Shortener']
    //  #swagger.description = 'Endpoint to get usage statistics for a short URL'
    /*  #swagger.parameters['shortId'] = {
            in: 'path',
            description: 'Shortened URL ID',
            required: true,
            type: 'string',
            example: 'abc123'
        }
    */
    /*  #swagger.responses[200] = {
            description: 'Usage statistics',
            schema: {
                type: 'object',
                properties: {
                    clicks: { type: 'integer', example: 10 },
                    lastAccessed: { type: 'string', example: '2024-11-23T10:20:30Z' }
                }
            }
        }
    */
    /*  #swagger.responses[404] = {
            description: 'URL not found',
            schema: { type: 'object', properties: { error: { type: 'string', example: 'URL not found' } } }
        }
    */
    /*  #swagger.responses[500] = {
            description: 'Server error',
            schema: { type: 'object', properties: { error: { type: 'string', example: 'Server error' } } }
        }
    */
    try {
        const { shortId } = req.params;
        const urlEntry = await UrlModel.findOne({ shortId });

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json({
            clicks: urlEntry.clicks,
            lastAccessed: urlEntry.lastAccessed,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { shortenUrl, redirectUrl, getStats };
