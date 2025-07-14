const axios = require('axios');

/**
 * Test admin login with API
 */
const testAdminLogin = async () => {
  try {
    console.log('Testing admin login with API...');
    
    // Using the debug login endpoint
    const response = await axios.post('http://localhost:5000/api/auth/admin-debug-login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    console.log('\nAuth token (save this):', response.data.token);
    
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testAdminLogin();
