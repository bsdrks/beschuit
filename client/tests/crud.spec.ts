import { test, expect, type ElementHandle, type Page } from '@playwright/test';

class MainPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('http://localhost:3000');
    }

    async addTask(title: string) {
        await this.inputTitle(title);
        await this.submitAddTaskForm();
    }

    inputTitle(text: string): Promise<void> {
        const input = this.page.getByPlaceholder('Task title…');

        return input.fill(text);
    }

    async submitAddTaskForm(): Promise<void> {
        const button = await this.page.$('button[type="submit"]');

        return button.click();
    }

    async getTasks(): Promise<ElementHandle[]> {
        await this.page.waitForSelector('ul');

        return this.page.$$('ul li');
    }

    async getTask(title: string): Promise<ElementHandle | null> {
        return await this.page.waitForSelector(`ul li:has-text("${title}")`);
    }
}

test('add and remove a task', async ({ page }) => {
    const mainPage = new MainPage(page);
    const random = Math.random().toString();
    const title = `Test task ${random}`;

    await mainPage.goto();

    const tasks = await mainPage.getTasks();
    const n = tasks.length;

    await mainPage.addTask(title);
    await mainPage.getTask(title);

    const tasksAfter = await mainPage.getTasks();

    expect(tasksAfter.length).toBe(n + 1);
});
