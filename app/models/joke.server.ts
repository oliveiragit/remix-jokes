import type { Joke } from "@prisma/client";
import type { FormErrorPayload } from "~/utils/request.server";

import { db } from "~/utils/db.server";
import { errorHandler } from "~/utils/request.server";
import {
  validateJokeContent,
  validateJokeName,
} from "~/utils/validations/joke.server";

export async function getJokes() {
  return await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });
}

export async function getJokeById(id: string) {
  return db.joke.findUnique({ where: { id } });
}

export async function getRandomJoke() {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  return randomJoke;
}

export async function createJoke(
  joke: Pick<Joke, "name" | "content" | "jokesterId">
) {
  const fieldErrors = {
    content: validateJokeContent(joke.content),
    name: validateJokeName(joke.name),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    errorHandler<FormErrorPayload>({
      type: "VALIDATION_FAILS",
      payload: {
        fieldErrors,
        fields: joke,
        formError: null,
      },
    });
  }

  return db.joke.create({ data: joke });
}

export async function updateJoke(
  joke: Pick<Joke, "id" | "name" | "content" | "jokesterId">
) {
  try {
    return db.joke.update({ where: { id: joke.id }, data: joke });
  } catch {
    return createJoke(joke);
  }
}

export async function deleteJoke(id: string) {
  return db.joke.delete({ where: { id } });
}
