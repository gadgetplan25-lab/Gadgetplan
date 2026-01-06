function validateEnv() {
  console.log('\n🔍 Validating environment variables...\n');

  const required = {
    // Database
    'DB_NAME': 'Database name',
    'DB_USER': 'Database user',
    'DB_PASSWORD': 'Database password',
    'DB_HOST': 'Database host',

    // JWT
    'JWT_SECRET': 'JWT secret key',
    'REFRESH_TOKEN_SECRET': 'Refresh token secret',

    // Email
    'EMAIL': 'Email address',
    'EMAIL_PASS': 'Email password',

    // App
    'FRONTEND_URL': 'Frontend URL',
    'NODE_ENV': 'Node environment'
  };

  const optional = {
    'PORT': 'Server port (default: 4000)',
    'ORIGIN': 'CORS origin (default: FRONTEND_URL)'
  };

  const missing = [];
  const present = [];

  // Check required
  Object.entries(required).forEach(([key, description]) => {
    // Allow empty string for DB_PASSWORD (common in local development)
    const value = process.env[key];
    if (value === undefined || value === null || (value === '' && key !== 'DB_PASSWORD')) {
      missing.push({ key, description });
    } else {
      present.push({ key, description });
    }
  });

  // Display results
  if (present.length > 0) {
    console.log('✅ Required variables found:');
    present.forEach(({ key, description }) => {
      const value = process.env[key];
      let masked;
      if (key === 'DB_PASSWORD' && value === '') {
        masked = '(empty - local dev)';
      } else if (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('TOKEN')) {
        masked = '***' + value.slice(-4);
      } else {
        masked = value.slice(0, 20) + (value.length > 20 ? '...' : '');
      }
      console.log(`   ✓ ${key.padEnd(25)} = ${masked}`);
    });
    console.log('');
  }

  // Check optional
  const optionalPresent = [];
  const optionalMissing = [];
  Object.entries(optional).forEach(([key, description]) => {
    if (process.env[key]) {
      optionalPresent.push({ key, description });
    } else {
      optionalMissing.push({ key, description });
    }
  });

  if (optionalPresent.length > 0) {
    console.log('ℹ️  Optional variables found:');
    optionalPresent.forEach(({ key }) => {
      console.log(`   ✓ ${key}`);
    });
    console.log('');
  }

  if (optionalMissing.length > 0) {
    console.log('⚠️  Optional variables missing (using defaults):');
    optionalMissing.forEach(({ key, description }) => {
      console.log(`   - ${key.padEnd(25)} (${description})`);
    });
    console.log('');
  }

  // Error if missing required
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:\n');
    missing.forEach(({ key, description }) => {
      console.error(`   ✗ ${key.padEnd(25)} - ${description}`);
    });
    console.error('\n💡 Please add these to your .env file\n');
    process.exit(1);
  }

  // Set defaults for optional variables
  if (!process.env.PORT) process.env.PORT = '4000';
  if (!process.env.ORIGIN) process.env.ORIGIN = process.env.FRONTEND_URL;

  console.log('✅ All required environment variables are set!\n');
}

module.exports = { validateEnv };