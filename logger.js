const logRequest = async (apikey, url, endpoint) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${endpoint} - ${apikey} - ${url}`);
};

module.exports = { logRequest };
