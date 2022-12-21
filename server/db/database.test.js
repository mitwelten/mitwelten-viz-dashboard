import { sequelize, Entry } from './database';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

test('create entry', async () => {
  expect.assertions(1);
  const entry = await Entry.create({
    id: 1,
    name: 'Entry 1',
    lat: 47.212,
    lng: 2.742323,
  });
  expect(entry.id).toEqual(1);
});

test('get entry', async () => {
  expect.assertions(2);
  const entry = await Entry.findByPk(1);
  expect(entry.name).toEqual('Entry 1');
  expect(entry.lat).toEqual(47.212);
});

test('delete entry', async () => {
  expect.assertions(1);
  await Entry.destroy({
    where: {
      id: 1,
    },
  });
  const entry = await Entry.findByPk(1);
  expect(entry).toBeNull();
});

afterAll(async () => {
  await sequelize.close();
});
