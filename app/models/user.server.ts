import type { FormErrorPayload } from "~/utils/request.server";

import { db } from "~/utils/db.server";
import { errorHandler } from "~/utils/request.server";
import {
  validateUserPassword,
  validateUserUsername,
} from "~/utils/validations/user.server";
import { createHash } from "~/utils/password.server";

type GetUserProps = { id: string } | { username: string };

export async function getUser(where: GetUserProps) {
  return db.user.findUnique({ where });
}

export async function createUser(user: { username: string; password: string }) {
  const fieldErrors = {
    username: validateUserUsername(user.username),
    password: validateUserPassword(user.password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    errorHandler<FormErrorPayload>({
      type: "VALIDATION_FAILS",
      payload: {
        fieldErrors,
        fields: user,
        formError: null,
      },
    });
  }

  const passwordHash = await createHash({ password: user.password });
  return db.user.create({ data: { passwordHash, username: user.username } });
}

export async function deleteUser(id: string) {
  return db.user.delete({ where: { id } });
}
