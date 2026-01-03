import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '30s', target: 300 },
    { duration: '30s', target: 500 },
    { duration: '30s', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/events`);
  const json = res.json();

  check(json, {
    'statusCode is 200': (r) => r.statusCode === 200,
    'success is true': (r) => r.success === true,
    'data is present': (r) => r.data !== undefined,
  });

  sleep(1); // 0.7
}