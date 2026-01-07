export const envVariableKeys = {
  // Environment
  env: 'ENV',
  buildTarget: 'BUILD_TARGET',

  // Database
  dbType: 'DB_TYPE',
  dbUrl: 'DB_URL',

  // JWT
  hashRounds: 'HASH_ROUNDS',
  accessTokenSecret: 'ACCESS_TOKEN_SECRET',
  refreshTokenSecret: 'REFRESH_TOKEN_SECRET',

  // OAuth - Kakao
  kakaoClientId: 'KAKAO_CLIENT_ID',
  kakaoClientSecret: 'KAKAO_CLIENT_SECRET',

  // OAuth - Naver
  naverClientId: 'NAVER_CLIENT_ID',
  naverClientSecret: 'NAVER_CLIENT_SECRET',

  // OAuth - Google
  googleClientId: 'GOOGLE_CLIENT_ID',
  googleClientSecret: 'GOOGLE_CLIENT_SECRET',

  // AWS S3
  awsAccessKeyId: 'AWS_ACCESS_KEY_ID',
  awsSecretAccessKey: 'AWS_SECRET_ACCESS_KEY',
  awsRegion: 'AWS_REGION',
  s3PublicBucket: 'S3_PUBLIC_BUCKET',
  s3PrivateBucket: 'S3_PRIVATE_BUCKET',

  // FCM
  fcmProjectId: 'FCM_PROJECT_ID',
  fcmServiceAccountPath: 'FCM_SERVICE_ACCOUNT_PATH',

  // Redis
  redisHost: 'REDIS_HOST',
  redisPort: 'REDIS_PORT',
};
