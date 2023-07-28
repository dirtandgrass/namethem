import bcrypt from 'bcryptjs'
import { auth_salt } from '../app';

export function randomHash(): string {
  const salt = bcrypt.genSaltSync(auth_salt);
  return bcrypt.hashSync(Math.random().toString(), salt);
}