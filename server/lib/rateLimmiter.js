import {rateLimit} from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 1*60*1000,
    limit: 2,
    message: "Try after 1 min"
})