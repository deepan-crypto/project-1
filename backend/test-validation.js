// Test script for backend validation
const testCases = [
    {
        name: "Valid signup",
        data: {
            fullName: "John Doe",
            email: "john@example.com",
            username: "john_doe123",
            password: "Test@1234",
            dateOfBirth: "1995-05-15",
            gender: "male"
        },
        shouldPass: true
    },
    {
        name: "Name with numbers (should fail)",
        data: {
            fullName: "John123 Doe",
            email: "john2@example.com",
            username: "john_doe2",
            password: "Test@1234",
            dateOfBirth: "1995-05-15",
            gender: "male"
        },
        shouldPass: false,
        expectedError: "Name can only contain letters and spaces"
    },
    {
        name: "Weak password (should fail)",
        data: {
            fullName: "Jane Doe",
            email: "jane@example.com",
            username: "jane_doe",
            password: "weak",
            dateOfBirth: "1995-05-15",
            gender: "female"
        },
        shouldPass: false,
        expectedError: "Password must be at least 8 characters"
    },
    {
        name: "Password without special char (should fail)",
        data: {
            fullName: "Bob Smith",
            email: "bob@example.com",
            username: "bob_smith",
            password: "Test1234",
            dateOfBirth: "1995-05-15",
            gender: "male"
        },
        shouldPass: false,
        expectedError: "special character"
    },
    {
        name: "Username with special chars (should fail)",
        data: {
            fullName: "Alice Johnson",
            email: "alice@example.com",
            username: "alice@johnson",
            password: "Test@1234",
            dateOfBirth: "1995-05-15",
            gender: "female"
        },
        shouldPass: false,
        expectedError: "Username can only contain letters, numbers, underscores, and hyphens"
    },
    {
        name: "User too young (should fail)",
        data: {
            fullName: "Young User",
            email: "young@example.com",
            username: "young_user",
            password: "Test@1234",
            dateOfBirth: "2015-05-15",
            gender: "male"
        },
        shouldPass: false,
        expectedError: "must be at least 13 years old"
    }
];

async function runTests() {
    console.log("🧪 Starting Backend Validation Tests\n");

    for (const test of testCases) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(test.data),
            });

            const data = await response.json();

            if (test.shouldPass) {
                if (response.ok) {
                    console.log(`✅ PASS: ${test.name}`);
                } else {
                    console.log(`❌ FAIL: ${test.name}`);
                    console.log(`   Expected: Success`);
                    console.log(`   Got: ${data.message || data.error}\n`);
                }
            } else {
                if (!response.ok && data.message?.includes(test.expectedError)) {
                    console.log(`✅ PASS: ${test.name}`);
                    console.log(`   Error: ${data.message}\n`);
                } else {
                    console.log(`❌ FAIL: ${test.name}`);
                    console.log(`   Expected error containing: "${test.expectedError}"`);
                    console.log(`   Got: ${data.message || data.error}\n`);
                }
            }
        } catch (error) {
            console.log(`❌ ERROR: ${test.name}`);
            console.log(`   ${error.message}\n`);
        }
    }

    console.log("\n✨ Tests complete!");
}

runTests();
