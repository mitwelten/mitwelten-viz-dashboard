const config =
  process.env.NODE_ENV === 'production'
    ? { url: '/api' }
    : {
        url: 'http://localhost:8080/api',
      };

export default config;
