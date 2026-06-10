import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ provider: "ollama", model: "e2e-local", content: "Mock local model response." }),
    });
  });

  await page.route("**/api/search", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        query: "local ai",
        results: [{ title: "Self-hosted search result", url: "https://example.local/search", snippet: "A private search result returned by the e2e mock.", engine: "mock" }],
      }),
    });
  });

  await page.route("**/api/workspace/notes/session.md", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ name: "session.md", content: "# Workspace notes\n\nSaved by e2e." }),
    });
  });

  await page.route("**/health", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "ok" }) });
  });
});

test("renders the Nexus AI workspace shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Nexus")).toBeVisible();
  await expect(page.getByText("Nexus is ready")).toBeVisible();
  await expect(page.getByPlaceholder(/Ask your local model/i)).toBeVisible();
});

test("shows provider badge in header", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Ollama")).toBeVisible();
});

test("sends a chat message and shows mock response", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder(/Ask your local model/i);
  await input.fill("Summarize my private workspace.");
  await page.getByTitle("Send").click();
  await expect(page.getByText("Summarize my private workspace.")).toBeVisible();
  await expect(page.getByText("Mock local model response.")).toBeVisible({ timeout: 10_000 });
});

test("sends message with Enter key", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder(/Ask your local model/i);
  await input.fill("Hello from keyboard.");
  await input.press("Enter");
  await expect(page.getByText("Hello from keyboard.")).toBeVisible();
  await expect(page.getByText("Mock local model response.")).toBeVisible({ timeout: 10_000 });
});

test("new chat button clears conversation", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder(/Ask your local model/i);
  await input.fill("Test message.");
  await page.getByTitle("Send").click();
  await expect(page.getByText("Test message.")).toBeVisible();
  await page.getByRole("button", { name: /new chat/i }).click();
  await expect(page.getByText("Nexus is ready")).toBeVisible();
});

test("runs search and shows results", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/Search via SearXNG/i).fill("local ai");
  await page.getByRole("button", { name: /go/i }).click();
  await expect(page.getByText("Self-hosted search result")).toBeVisible();
});

test("switches to notes tab and saves note", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /notes/i }).last().click();
  await expect(page.locator(".notes-textarea")).toBeVisible();
  await page.locator(".notes-textarea").fill("# Workspace notes\n\nSaved by e2e.");
  await page.getByRole("button", { name: /save/i }).last().click();
});

test("sidebar collapses and expands", async ({ page }) => {
  await page.goto("/");
  const toggleBtn = page.locator(".sidebar-toggle");
  await toggleBtn.click();
  await expect(page.locator(".brand-name")).toBeHidden();
  await toggleBtn.click();
  await expect(page.locator(".brand-name")).toBeVisible();
});
