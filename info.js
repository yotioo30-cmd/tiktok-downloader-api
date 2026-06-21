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

    if (response.data.code !== 0) {
      throw new Error('Failed to fetch info');
    }

    const data = response.data.data;
    await logRequest(apikey || 'unknown', url, 'info');

    res.json({
      status: true,
      creator: 'Tio',
      result: {
        title: data.title || 'No title',
        description: data.title || '',
        author: data.author?.unique_id || 'Unknown',
        author_id: data.author?.id || '0',
        duration: data.duration || 0,
        cover: data.cover || '',
        thumbnail: data.cover || '',
        statistics: {
          likes: data.digg_count || 0,
          comments: data.comment_count || 0,
          shares: data.share_count || 0,
          views: data.play_count || 0
        },
        create_time: data.create_time || new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Failed to fetch info'
    });
  }
};
