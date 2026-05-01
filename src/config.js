const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

module.exports = {
  port:     Number(process.env.PORT || 8080),
  env:      process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  db: {
    host:     process.env.DB_HOST || 'localhost',
    port:     Number(process.env.DB_PORT || 5432),
    name:     required('DB_NAME'),
    user:     required('DB_USER'),
    password: required('DB_PASSWORD'),
    cloudSqlInstance: process.env.CLOUD_SQL_INSTANCE_CONNECTION_NAME || null,
  },

  jwt: {
    secret:     required('JWT_SECRET'),
    ttlSeconds: Number(process.env.JWT_TTL_SECONDS || 3600),
    issuer:     'user-manager',
  },

  bcryptCost: Number(process.env.BCRYPT_COST || 12),
};
