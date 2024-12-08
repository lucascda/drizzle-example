import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });

const main = async () => {
  const { todos } = schema;

  try {
    console.log("Seeding database");

    await db.delete(todos);
    const todoSeed = new Array(20).fill({}).map((e, i) => {
      return {
        id: faker.string.uuid(),
        task: faker.lorem.sentence({ min: 3, max: 5 }),
        description: faker.lorem.paragraph(),
        dueDate: faker.date.anytime(),
        isDone: faker.datatype.boolean(),
        doneAt: faker.date.anytime(),
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
      };
    });

    await db.insert(todos).values(todoSeed);
    pool.end();
    console.log("Seeding complete");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
