import bcrypt from "bcryptjs";

export async function createHash({ password }: { password: string }) {
  return bcrypt.hash(password, 10);
}

export async function compareHashes({
  password,
  passwordHash,
}: {
  password: string;
  passwordHash: string;
}) {
  return await bcrypt.compare(password, passwordHash);
}
