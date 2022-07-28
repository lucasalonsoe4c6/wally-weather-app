import jwt from 'jsonwebtoken';

beforeEach(() => {
    localStorage.clear()
    cy.visit('https://wally-weather-app.vercel.app/login');
});

describe('Field validation', () => {
    it('Shows error while submitting empty fields', () => {
        cy.get('button')
            .should('have.text', 'Login')
            .click();
        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'Please add an email')
    });

    it('Shows error while submitting invalid email', () => {
        cy.get('input[type="email"]')
            .type('Whatever@abc');
        cy.get('button')
            .should('have.text', 'Login')
            .click();
        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'Please enter a valid email');
    })

    it('Shows error while submitting a password too short', () => {
        cy.get('input[type="email"]')
            .type('Whatever@gmail.com');
        cy.get('input[type="password"]')
            .type('abc');
        cy.get('button')
            .should('have.text', 'Login')
            .click();
        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'Password too short');
    });
    it('Shows error while submitting a password too long', () => {
        cy.get('input[type="email"]')
            .type('Whatever@gmail.com');
        cy.get('input[type="password"]')
            .type('superlongpasswordthatshouldfailthetest');
        cy.get('button')
            .should('have.text', 'Login')
            .click();
        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'Password too long');
    });
});

describe('Failed login', () => {
    it('Shows error when login fails', () => {
        cy.intercept('POST', 'https://wally-weather-app.vercel.app/api/user/login', {
            body: { code: 0, message: 'User not found' }
        }).as('login');

        cy.get('input[type="email"]')
            .type('someemailthatshouldnotexistasauser@gmail.com');
        cy.get('input[type="password"]')
            .type('password');
        cy.get('button')
            .should('have.text', 'Login')
            .click();

        cy.wait('@login');

        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'User not found');
    });
});

describe('Succesful login', () => {
    it('Logins successfully and redirects to home', () => {
        const token = jwt.sign({
            _id: '123456',
            email: 'someemail@gmail.com',
        }, 'testkey', { expiresIn: '1h' });

        cy.intercept('POST', 'https://wally-weather-app.vercel.app/api/user/login', {
            body: { code: 1, message: '', token }
        }).as('login');

        cy.get('input[type="email"]')
            .type('someemailthatshouldnotexistasauser@gmail.com');
        cy.get('input[type="password"]')
            .type('password');
        cy.get('button')
            .should('have.text', 'Login')
            .click();

        cy.wait('@login');

        cy.url().should('match', /\/$/);
        cy.get('a.nav-link').should('have.text', 'Logout');
    });
});