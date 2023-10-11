import type { User } from "@prisma/client";

import type { FormErrorPayload } from "~/utils/request.server";
import { db } from "~/utils/db.server";
import { errorHandler } from "~/utils/request.server";
import {
  validateUserPassword,
  validateUserUsername,
} from "~/utils/validations/user.server";
import { compareHashes } from "~/utils/password.server";
import { createUserSession, getUserId, logout } from "~/utils/session.server";
import { createUser, getUser } from "./user.server";

export async function getUserBySession(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function login(
  { id, passwordHash, username }: User,
  password: string,
  redirect: string
) {
  const isPasswordCorrect = await compareHashes({ passwordHash, password });

  if (!isPasswordCorrect) {
    throw errorHandler<FormErrorPayload>({
      type: "VALIDATION_FAILS",
      payload: {
        fieldErrors: null,
        fields: { username },
        formError: "password/username Invalid",
      },
    });
  }

  return createUserSession(id, redirect);
}

export async function register(
  user: { username: string; password: string },
  redirect: string
) {
  const { id } = await createUser(user);
  return createUserSession(id, redirect);
}

export async function createSession({
  user,
  loginType,
  redirect,
}: {
  user: { username: string; password: string };
  loginType: string;
  redirect: string;
}) {
  const fieldErrors = {
    username: validateUserUsername(user.username),
    password: validateUserPassword(user.password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    throw errorHandler<FormErrorPayload>({
      type: "VALIDATION_FAILS",
      payload: {
        fieldErrors,
        fields: { ...user, loginType },
        formError: null,
      },
    });
  }

  const userEntity = await getUser({ username: user.username });

  switch (loginType) {
    case "login": {
      if (!userEntity) {
        throw errorHandler({
          type: "VALIDATION_FAILS",
          payload: {
            fieldErrors: null,
            fields: { username: user.username },
            formError: "password/username Invalid",
          },
        });
      }

      return login(userEntity, user.password, redirect);
    }
    case "register": {
      if (userEntity) {
        throw errorHandler({
          type: "VALIDATION_FAILS",
          payload: {
            formError: `User with username ${user.username} already exists`,
          },
        });
      }

      return register(user, redirect);
    }
    default: {
      throw errorHandler({
        type: "VALIDATION_FAILS",
        payload: {
          fieldErrors: null,
          fields: { username: user.username },
          formError: "Not implemented",
        },
      });
    }
  }
}

export async function deleteUser(id: string) {
  return db.user.delete({ where: { id } });
}
