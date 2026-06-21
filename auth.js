const API_KEY = process.env.API_KEY_SECRET || 'TI0_API_2026';

const validateApiKey = (req, res, next) => {
  const apikey = req.query.apikey || req.headers['x-api-key'];

  if (!apikey) {
    return res.status(401).json({
      status: false,
      code: 401,
      message: 'API Key is required'
    });
  }

  if (apikey !== API_KEY) {
    return res.status(401).json({
      status: false,
      code: 401,
      message: 'Invalid API Key'
    });
  }

  req.apikey = apikey;
  next();
};

module.exports = { validateApiKey };
