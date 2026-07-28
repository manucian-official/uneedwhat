import { expect, test } from "@playwright/test";

test("landing page shows the new recruitment hero", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /modern recruitment/i })).toBeVisible();
  await expect(page.getByText("Recruitment platform")).toBeVisible();
  await expect(page.getByRole("button", { name: /start free/i }).nth(1)).toBeVisible();
});

test("user can sign in and sign out", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("hr@uneedwhat.com");
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

  await page.getByRole("button", { name: /logout/i }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
});
