import axiosInstance from '../../../../src/axios/axios.jsx';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axiosInstance);

export const baseGoal = {
  id: 1,
  name: 'Test Goal',
  description: 'A test goal description',
  end_date: new Date().toISOString(),
  location: 'Test City',
  is_public: true,
  is_owner: true,
};

export const mockGoals = [
  {
    id: 1,
    name: 'Learn Spanish',
    is_owner: true,
    is_public: false,
    description: "Learning spanish for college",
    end_date: new Date(Date.now() + 86400000).toISOString(),
    location: "Skopje"
  },
  {
    id: 2,
    name: 'Build Side Project',
    is_owner: true,
    is_public: true,
    description: "Create a portfolio project",
    end_date: new Date(Date.now() - 86400000).toISOString(),
    location: "Ohrid",
    sharedCount: 3
  }
];

mock.onGet('/goals/').reply(200, mockGoals.filter(g => g.is_public));
mock.onGet('/goals/my/').reply(200, mockGoals); // All user goals
mock.onGet('/goals/1/').reply(200, mockGoals[0]);
mock.onPost('/goals/join/').reply(200, { success: true });
mock.onPost('/goals/leave/').reply(200, { success: true });
mock.onPost('/goals/').reply(201, mockGoals[0]);
mock.onPut('/goals/1/').reply(200, mockGoals[0]);
mock.onPatch('/goals/1/').reply(200, mockGoals[0]);
mock.onDelete('/goals/1/').reply(204);

export { mock };
