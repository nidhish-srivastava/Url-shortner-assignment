const {rateLimit} = require("express-rate-limit")

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 100, // Limiting each IP to 100 requests per `window` (here, per 1 minute).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

module.exports = {rateLimiter}