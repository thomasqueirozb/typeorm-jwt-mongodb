export default {
    jwtSecret: process.env.jwtSecret,
    jwtExpire: process.env.jwtExpire || "1h"
};
