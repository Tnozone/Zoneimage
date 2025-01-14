import { registerUser } from './auth';
import { getDb } from '../lib/mongodb';
import bcrypt from 'bcrypt';

jest.mock('../lib/mongodb', () => ({
  getDb: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('registerUser', () => {
  let mockUsersCollection;

  beforeEach(() => {
    mockUsersCollection = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
    };

    getDb.mockResolvedValue({
      collection: jest.fn(() => mockUsersCollection),
    });
  });

  it('should register a new user successfully', async () => {
    const name = 'Max';
    const email = 'max@example.com';
    const password = 'securePassword123';

    mockUsersCollection.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');

    const result = await registerUser(name, email, password);

    expect(mockUsersCollection.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(mockUsersCollection.insertOne).toHaveBeenCalledWith({
      name,
      email,
      password: 'hashedPassword',
    });
    expect(result).toBeDefined();
  });

  it('should throw an error if the email already exists', async () => {
    mockUsersCollection.findOne.mockResolvedValue({ email: 'max@example.com' });

    await expect(registerUser('Max', 'max@example.com', 'securePassword123'))
      .rejects
      .toThrow('User with this email already exists');
  });
});