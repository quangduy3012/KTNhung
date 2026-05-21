
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  // tránh spam request
  fullyParallel: false,

  workers: 1,

  reporter: 'html',

  use: {

    headless: false,

    // chạy chậm để nhìn
    launchOptions: {
      slowMo: 1000,
    },

    baseURL: 'https://nguyencongpc.vn',

    trace: 'on-first-retry',
  },

  projects: [

    // login 1 lần
    {
      name: 'setup',

      testMatch: /auth\.setup\.js/,
    },

    // test cần login
    {
      name: 'authenticated',

      testMatch: /update-profile\.spec\.js/,

      use: {
        ...devices['Desktop Chrome'],

        storageState: 'playwright/.auth/user.json',
      },

      dependencies: ['setup'],
    },

    // test chưa login
    {
      name: 'guest',

      testMatch: [
        /login\.spec\.js/,
        /register\.spec\.js/,
      ],

      use: {
        ...devices['Desktop Chrome'],
      },
    },

  ],

});
