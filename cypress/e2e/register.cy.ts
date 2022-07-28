import jwt from 'jsonwebtoken';

beforeEach(() => {
    localStorage.clear();
    cy.visit('http://localhost:5000/register');
});

describe('Field validation', () => {
    it('Shows error while submitting empty fields', () => {
        cy.get('button')
            .should('have.text', 'Register')
            .click();
        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'Please add an email')
    });

    it('Shows error while submitting invalid email', () => {
        cy.get('input[type="email"]')
            .type('Whatever@abc');
        cy.get('button')
            .should('have.text', 'Register')
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
            .should('have.text', 'Register')
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
            .should('have.text', 'Register')
            .click();
        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'Password too long');
    });
});

describe('Failed Register', () => {
    it('Shows error when Register fails', () => {
        cy.intercept('POST', 'http://localhost:5000/api/user/register', {
            body: { code: 0, message: 'Error' }
        }).as('Register');

        cy.get('input[type="email"]')
            .type('someemailthatshouldnotexistasauser@gmail.com');
        cy.get('input[type="password"]')
            .type('password');
        cy.get('button')
            .should('have.text', 'Register')
            .click();

        cy.wait('@Register');

        cy.get('p.text-danger')
            .should('exist')
            .and('have.text', 'Error');
    });
});

describe('Succesful Register', () => {
    it('Registers successfully and redirects to home', () => {
        const token = jwt.sign({
            _id: '123456',
            email: 'someemail@gmail.com',
        }, 'testkey', { expiresIn: '1h' });

        cy.intercept('POST', 'http://localhost:5000/api/user/register', {
            body: { code: 1, message: '', token }
        }).as('Register');

        cy.get('input[type="email"]')
            .type('someemailthatshouldnotexistasauser@gmail.com');
        cy.get('input[type="password"]')
            .type('password');
        cy.get('button')
            .should('have.text', 'Register')
            .click();

        cy.wait('@Register');

        cy.url().should('match', /\/$/);
        cy.get('a.nav-link').should('have.text', 'Logout');
    });
});