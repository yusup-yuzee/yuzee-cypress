import { faker } from "@faker-js/faker";

// Generate a random first name using Faker
Cypress.Commands.add("generateRandomFirstName", () => {
    return faker.person.firstName();
});

// Generate a random last name using Faker
Cypress.Commands.add("generateRandomLastName", () => {
    return faker.person.lastName();
});

// Generate a random email using a custom domain
Cypress.Commands.add("generateRandomEmail", () => {
    const randomPrefix = "user_" + Math.random().toString(36).substring(2, 10);
    const email = `${randomPrefix}@${Cypress.env(
        "MAILOSAUR_SERVER_ID"
    )}.mailosaur.net`;
    return cy.wrap(email);
});

// Generate a random password
Cypress.Commands.add("generateRandomPassword", () => {
    const randomPassword = `!${Math.random()
        .toString(36)
        .substring(2, 12)}${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;
    return randomPassword;
});

// Get the OTP code from the email using Mailosaur API
Cypress.Commands.add("getOtpFromMailosaur", (email) => {
    const apiKey = Cypress.env("MAILOSAUR_API_KEY");
    const serverId = Cypress.env("MAILOSAUR_SERVER_ID");
    const messagesUrl = `https://mailosaur.com/api/messages?server=${serverId}&sent_to=${email}`;

    return cy
        .request({
            method: "GET",
            url: messagesUrl,
            headers: {
                Authorization: `Basic ${btoa(`${apiKey}:`)}`,
            },
        })
        .then((response) => {
            // Check if the response status is OK
            expect(response.status).to.eq(200);

            // Handle case when no emails are found
            const messages = response.body.items;
            if (messages.length === 0) {
                throw new Error(
                    `No emails found for the provided email: ${email}`
                );
            }

            // Get the latest email
            const latestEmailId = messages[0].id;
            const messageDetailsUrl = `https://mailosaur.com/api/messages/${latestEmailId}`;

            return cy
                .request({
                    method: "GET",
                    url: messageDetailsUrl,
                    headers: {
                        Authorization: `Basic ${btoa(`${apiKey}:`)}`,
                    },
                })
                .then((detailsResponse) => {
                    // Check if the response status is OK
                    expect(detailsResponse.status).to.eq(200);

                    // Extract OTP code from the email content
                    const otpCode = detailsResponse.body.text.codes[0]?.value;
                    if (!otpCode) {
                        throw new Error("No OTP code found in the email.");
                    }

                    return otpCode;
                });
        });
});
