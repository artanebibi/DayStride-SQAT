// tests/integration/in-the-small/Habits/habitMocks.js
import MockAdapter from "axios-mock-adapter";
import axiosInstance from "../../../../src/axios/axios.jsx";

const fixedTimestamp = 1751638061472;

export const mockHabits = [
    {
        id: 1,
        name: "Habit 1",
        description: "Description for Habits 1",
        created_at: fixedTimestamp,
        completed: true,
    },
    {
        id: 2,
        name: "Habit 2",
        description: "Another habit",
        created_at: fixedTimestamp,
        completed: false,
    }
];

export const mock = new MockAdapter(axiosInstance, { delayResponse: 50 });

mock.onGet("/habits/").reply(200, mockHabits);
mock.onGet("/habits/1/").reply(200, mockHabits[0]);
mock.onPost("/habits/").reply(201, mockHabits[0]);
mock.onPut("/habits/1/").reply(200, mockHabits[0]);
mock.onPatch("/habits/1/").reply(200, mockHabits[0]);
mock.onDelete("/habits/1/").reply(204);

export default { mock };