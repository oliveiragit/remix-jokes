import type { Joke } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getJokes() {
  return await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });
}

export async function getJokeById(id: string) {
  return db.joke.findUnique({ where: { id } });
}

export async function createJoke(joke: Pick<Joke, "name" | "content">) {
  return db.joke.create({ data: joke });
}

export async function updateJoke(joke: Pick<Joke, "id" | "name" | "content">) {
  try {
    return db.joke.update({ where: { id: joke.id }, data: joke });
  } catch {
    return createJoke(joke);
  }
}

export async function deleteJoke(id: string) {
  return db.joke.delete({ where: { id } });
}
