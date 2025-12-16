// Test script for profile update endpoint
async function testProfileUpdate() {
    console.log('🧪 Testing Profile Update Endpoint\n');

    // First, login to get token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'testuser',
            password: 'Test@1234'
        }),
    });

    if (!loginResponse.ok) {
        console.log('❌ Login failed. Create a test user first.');
        console.log('   Run: node test-validation.js with valid credentials\n');
        return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Logged in successfully\n');

    // Test 1: Update profile without image
    console.log('Test 1: Update profile text fields only');
    try {
        const formData = new FormData();
        formData.append('fullName', 'Updated Name');
        formData.append('bio', 'This is my updated bio!');

        const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            console.log('✅ PASS: Text fields updated');
            console.log(`   Name: ${data.user.fullName}`);
            console.log(`   Bio: ${data.user.bio}\n`);
        } else {
            console.log('❌ FAIL:', data.message, '\n');
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message, '\n');
    }

    // Test 2: Update with invalid name (contains numbers)
    console.log('Test 2: Update with invalid name (should fail)');
    try {
        const formData = new FormData();
        formData.append('fullName', 'John123 Doe');

        const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok && data.message.includes('letters and spaces')) {
            console.log('✅ PASS: Invalid name rejected');
            console.log(`   Error: ${data.message}\n`);
        } else {
            console.log('❌ FAIL: Should have rejected name with numbers\n');
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message, '\n');
    }

    console.log('✨ Tests complete!');
    console.log('\n📝 Note: To test image upload, you need to run this from a browser');
    console.log('   or use a tool like Postman/cURL with actual image files.');
}

testProfileUpdate();
