import { getDb } from '../lib/mongodb.js';

async function findUserByEmail(email) {
  const db = await getDb();
  const user = await db.collection('users').findOne({ email });
  return user;
}

async function deleteUserById(userId) {
  const db = await getDb();
  await db.collection('users').deleteOne({ _id: userId });
}

export { findUserByEmail, deleteUserById };