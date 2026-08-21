/**
 * Shared fake Clerk user for tests that need to bypass real auth.
 * Not a real account — used only as the return value of mocked
 * @clerk/nextjs/server calls (auth(), auth.protect(), currentUser()).
 */
export const testUser = {
  id: "test_user_id",
  email: "test@user.com",
  password: "test@user.com123",
}
