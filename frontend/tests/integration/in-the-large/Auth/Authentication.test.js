// tests/integration/in-the-large/Auth/Authentication.test.js
import axios from '../../../../src/axios/axios';


describe('Authentication Test', () => {
    const testUser = {
        username: `user_${Date.now()}`,
        email: `user_${Date.now()}@test.com`,
        password: 'test'

    }

    beforeAll(async () => {
        const response = await axios.post('/register/', {
            username: testUser.username,
            email: testUser.email,
            password: testUser.password
        });

        expect(response.status).toBe(201)

    })

    test('Login after registering dummy user', async () => {
        const response = await axios.post('/token/', {
            username: testUser.username,
            password: testUser.password
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('access');
        expect(response.data).toHaveProperty('refresh');
    });

    test('fails to login with invalid credentials', async () => {
        try {
            await axios.post('/token/', {
                username: 'INVALID',
                password: 'INVALID_PASSWORD',
            });
        } catch (err) {
            expect(err.response.status).toBe(401);
            expect(err.response.data).toHaveProperty('detail');
        }
    });

    test('Logout after login of dummy user', async () => {
        const response = await axios.post('/token/', {
            username: testUser.username,
            password: testUser.password
        });
        if (response.status === 201) {
            localStorage.removeItem("tokens");
            expect(localStorage.getItem("tokens")).toBe("")
        }
    })

});