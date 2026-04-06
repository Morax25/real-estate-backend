import { User } from '../models/user.model.js';
import { IUser } from '../models/user.types.js';
import { DomainError } from '../utils/domainError.js';

export const createUser = async (user: IUser) => {
  const foundUser = await User.findOne({ email: user.email });
  if (foundUser) {
    throw new DomainError(
      'ALREADY_EXISTS',
      'User with this email already exists'
    );
  }
  const newUser = new User(user);
  await newUser.save();
  return newUser;
};

export const userLogin = async (user: IUser) => {
  const foundUser = await User.findOne({ email: user.email }).select(
    '+password'
  );
  if (!foundUser) {
    throw new DomainError('NOT_FOUND', 'User not found');
  }
  if (!user.password) {
    throw new DomainError('BAD_REQUEST', 'Password is required');
  }
  const isPasswordMatch = await foundUser.comparePassword(user.password);
  if (!isPasswordMatch) {
    throw new DomainError('UNAUTHORIZED', 'Incorrect password');
  }
  foundUser.password = undefined as any; // hide password before returning
  return foundUser;
};
