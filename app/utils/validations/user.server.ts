export function validateUserUsername(name: string) {
  if (name.length < 3) {
    return "Usernames must be at least 3 characters long";
  }
}

export function validateUserPassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}
