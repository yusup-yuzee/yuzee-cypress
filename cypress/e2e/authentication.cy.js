describe("Authentication Flow", () => {
    it("should display correct buttons, open modal, fill up the registration form", () => {
        // Visit the starting page
        cy.visit("/");

        // Verify the buttons are visible
        cy.contains("button", "Join Yuzee").should("exist").and("be.visible");
        cy.contains("button", "Sign in").should("exist").and("be.visible");

        // Click the "Join Yuzee" button
        cy.contains("button", "Join Yuzee").click();

        // Verify the modal is visible
        cy.get(".modal-header")
            .should("be.visible")
            .within(() => {
                cy.get("h1").should("contain.text", "Sign Up");
            });

        // Generate random data
        cy.generateRandomFirstName().then((randomFirstName) => {
            cy.generateRandomLastName().then((randomLastName) => {
                cy.generateRandomEmail().then((randomEmail) => {
                    cy.generateRandomPassword().then((randomPassword) => {
                        cy.log(
                            randomFirstName,
                            randomLastName,
                            randomEmail,
                            randomPassword
                        );

                        // Alias the generated data
                        cy.wrap(randomFirstName).as("generatedFirstName");
                        cy.wrap(randomLastName).as("generatedLastName");
                        cy.wrap(randomEmail).as("generatedEmail");
                        cy.wrap(randomPassword).as("generatedPassword");

                        // Fill in the registration form using aliases
                        cy.get("@generatedFirstName").then((firstName) => {
                            cy.get('input[formcontrolname="firstName"]').type(
                                firstName
                            );
                        });
                        cy.get("@generatedLastName").then((lastName) => {
                            cy.get('input[formcontrolname="lastName"]').type(
                                lastName
                            );
                        });
                        cy.get("@generatedEmail").then((email) => {
                            cy.get('input[formcontrolname="email"]').type(
                                email
                            );
                        });
                        cy.get("@generatedPassword").then((password) => {
                            cy.get('input[formcontrolname="password"]').type(
                                password
                            );
                        });

                        // Continue to fill out other parts of the form
                        cy.get('input[name="dob"]').click();
                        cy.get('select[aria-label="Select month"]').select("1");
                        cy.get('select[aria-label="Select year"]').select(
                            "2000"
                        );
                        cy.get("div[ngbdatepickerdayview]")
                            .contains("1")
                            .click();
                        cy.get('ng-select[formcontrolname="gender"]').click();
                        cy.get('div[role="option"]').contains("Male").click();
                        cy.get('input[formcontrolname="postal_code"]').type(
                            "3000"
                        );

                        // Submit the form
                        cy.contains("button", "Sign Up").click();
                    });
                });
            });
        });

        // Verify with the OTP code
        cy.get("@generatedEmail").then((email) => {
            // Wait for the OTP email to arrive
            cy.wait(10000);

            // Get the OTP code from the email
            cy.getOtpFromMailosaur(email).then((otp) => {
                cy.log("Received OTP:", otp);

                // Fill in the OTP code
                const otpString = otp.toString();
                for (let i = 0; i < otpString.length; i++) {
                    cy.get(`input[formcontrolname="digit${i + 1}"]`).type(
                        otpString[i]
                    );
                }

                // Click the submit button
                cy.get("div.modal-footer.border-0")
                    .find('button[type="submit"].btn-blue')
                    .click();
            });
        });

        // Verify the user is greeted with their first name and last name
        cy.get("@generatedFirstName").then((firstName) => {
            cy.get("@generatedLastName").then((lastName) => {
                cy.get("div.title-lg.ng-star-inserted > span.pl-1").should(
                    "have.text",
                    `${firstName} ${lastName}!`
                );
            });
        });

        // Start the onboarding
        cy.contains("button", "Let's Start!").click();

        // Step 1
        cy.contains("h4", "Internship").click();
        cy.get('button[type="submit"].btn-blue')
            .should("not.be.disabled")
            .click();

        // Step 2
        cy.get('label[for="workExperience"]').click();
        cy.get('button[type="submit"].btn-blue')
            .should("not.be.disabled")
            .click();

        // Step 3
        cy.contains("button", "Skip").click();

        // Step 4
        cy.contains("button", "Skip").click();

        // Step 5
        cy.contains("button", "Skip").click();

        // Complete the onboarding
        cy.contains("button", "Let's Go!").click();
    });
});
