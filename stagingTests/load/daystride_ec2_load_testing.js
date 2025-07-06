import http from 'k6/http';
import {check, sleep} from 'k6';

export let options = {
    stages: [
        {duration: '10s', target: 3},
        {duration: '20s', target: 5},
        {duration: '20s', target: 10},
        {duration: '20s', target: 10},
        {duration: '10s', target: 0},
    ],
    thresholds: {
        http_req_duration: ['p(95)<1500'],  // allow up to 1.5s latency under load
        http_req_failed: ['rate<0.10'],     // <10% failure rate acceptable under stress
    },

};

export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:80';

    // Get Landing Page
    let res = http.get(`${BASE_URL}/`);
    check(res, {'GET / status 200': (r) => r.status === 200});
    sleep(0.5);

    // Go to Dashboard
    res = http.get(`${BASE_URL}/dashboard`);
    check(res, {'GET /dashboard status 200': (r) => r.status === 200});
    sleep(0.5);

    // Go to GoalHub
    res = http.get(`${BASE_URL}/goalhub`);
    check(res, {'GET /goalhub status 200': (r) => r.status === 200});
    sleep(0.5);

    // Go to Goals
    res = http.get(`${BASE_URL}/goals`);
    check(res, {'GET /goals status 200': (r) => r.status === 200});
    sleep(0.5);

    // Return to Dashboard
    res = http.get(`${BASE_URL}/dashboard`);
    check(res, {'GET /dashboard (return) status 200': (r) => r.status === 200});
    sleep(1); // simulate user think time before next iteration
}
