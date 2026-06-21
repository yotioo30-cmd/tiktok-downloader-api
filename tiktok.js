const axios = require('axios');
const { validateTikTokUrl, formatResponse } = require('../lib/utils');
const { logRequest } = require('../lib/logger');

module.exports = async (req, res) => {
  try {
    const { url, apikey } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'URL parameter is required'
      });
    }

    if (!validateTikTokUrl(url)) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'Invalid TikTok URL'
      });
    }

    // Fetch data from API
    const response = await axios.get('https://www.tikwm.com/api/', {
      params: { url, count: 12, cursor: 0, web: 1, hd: 1 },
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (response.data.code !== 0) {
      throw new Error('Failed to fetch video');
    }

    await logRequest(apikey || 'unknown', url, 'tiktok');

    res.json({
      status: true,
      creator: 'Tio',
      result: formatResponse(response.data.data)
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Failed to fetch video'
    });
  }
};
