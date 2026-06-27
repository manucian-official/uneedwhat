import { expect, test } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /tuyen dung dung nguoi/i })).toBeVisible();
  await expect(page.getByText("Featured jobs")).toBeVisible();
});

test("user can login and logout", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Dang nhap", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /login dialog/i })).toBeVisible();

  await page.getByLabel("Email").fill("hr@uneedwhat.com");
  await page.getByLabel("Password").fill("secret123");
  await page.getByLabel("Vai tro").selectOption("HR");
  await page.getByRole("button", { name: /^Login$/i }).click();

  await expect(page.getByText(/xin chao hr/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

  await page.getByRole("button", { name: /logout/i }).click();
  await expect(page.getByRole("button", { name: "Dang nhap", exact: true })).toBeVisible();
});
