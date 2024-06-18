jest.mock('./lib/redis.js', () => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
}));