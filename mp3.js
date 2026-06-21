const axios = require('axios');
const { validateTikTokUrl } = require('../lib/utils');
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

    const response = await axios.get('https://www.tikwm.com/api/', {
      params: { url, web: 1 },
      timeout: 10000
    });

    if (response.data.code !== 0 || !response.data.data.music) {
      throw new Error('No audio found');
    }

    await logRequest(apikey || 'unknown', url, 'mp3');

    res.json({
      status: true,
      creator: 'Tio',
      result: {
        audio: response.data.data.music
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Failed to fetch audio'
    });
  }
};
