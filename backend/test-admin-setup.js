const axios = require('axios');

const testAdminSetup = async () => {
  try {
    console.log('🔄 Testing admin setup...');
    
    // Test 1: Check if first admin setup is needed
    const checkResponse = await axios.get('http://localhost:5000/api/auth/check-first-admin');
    console.log('✅ Check first admin response:', checkResponse.data);
    
    if (checkResponse.data.isFirstAdminSetup) {
      console.log('📝 Setting up first admin...');
      
      // Test 2: Setup first admin
      const setupResponse = await axios.post('http://localhost:5000/api/auth/setup-first-admin', {
        name: 'Admin Test',
        email: 'admin@test.com',
        password: 'admin123',
        secretKey: 'admin123'
      });
      
      console.log('✅ Setup admin response:', setupResponse.data);
    } else {
      console.log('ℹ️ Admin already exists');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
};

testAdminSetup();
