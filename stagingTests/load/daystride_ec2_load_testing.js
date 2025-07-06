// Updated `daystride_frontend_loadtest.js` per your new plan

import http from 'k6/http';
import {check, sleep} from 'k6';

export let options = {
    stages: [
        {duration: '10s', target: 3},
        {duration: '10s', target: 3},
        {duration: '10s', target: 0},
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.05'],
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:80';

    // 1️⃣ Get Landing Page
    let res = http.get(`${BASE_URL}/`);
    check(res, {'GET / status 200': (r) => r.status === 200});
    sleep(0.5);

    // 2️⃣ Go to Dashboard
    res = http.get(`${BASE_URL}/dashboard`);
    check(res, {'GET /dashboard status 200': (r) => r.status === 200});
    sleep(0.5);

    // 3️⃣ Go to GoalHub
    res = http.get(`${BASE_URL}/goalhub`);
    check(res, {'GET /goalhub status 200': (r) => r.status === 200});
    sleep(0.5);

    // 4️⃣ Go to Goals
    res = http.get(`${BASE_URL}/goals`);
    check(res, {'GET /goals status 200': (r) => r.status === 200});
    sleep(0.5);

    // 5️⃣ Return to Dashboard
    res = http.get(`${BASE_URL}/dashboard`);
    check(res, {'GET /dashboard (return) status 200': (r) => r.status === 200});
    sleep(1); // simulate user think time before next iteration
}
