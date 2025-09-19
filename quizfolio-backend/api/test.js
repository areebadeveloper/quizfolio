// A simple test endpoint to verify Vercel function deployment
module.exports = (req, res) => {
  res.status(200).json({
    message: 'API test endpoint is working',
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
}; 