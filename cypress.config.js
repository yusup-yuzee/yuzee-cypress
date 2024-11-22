const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
    env: {
        MAILOSAUR_API_KEY: process.env.MAILOSAUR_API_KEY,
        MAILOSAUR_SERVER_ID: process.env.MAILOSAUR_SERVER_ID,
    },
    e2e: {
        baseUrl: "https://dev.yuzee.click",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
