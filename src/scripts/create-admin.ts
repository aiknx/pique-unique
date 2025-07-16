import 'dotenv';
import 'node-fetch';

async function createAdminUser() {
  const email = 'admin@test.com';
  const password = 'test123';
  
  try {
    const response = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to create user: ${JSON.stringify(data)}`);
    }

    console.log('Admin user created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

createAdminUser(); 