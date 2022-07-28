import { WeatherResponse } from "../../types";

before(() => {
    cy.visit('http://localhost:5000/login');
    cy.get('input[type="email"]')
        .type('mycoolemail@gmail.com');
    cy.get('input[type="password"]')
        .type('mycoolemail');
    cy.get('button')
        .should('have.text', 'Login')
        .click();
});


describe('Home', () => {
    it('Should display server side data', () => {
        cy.visit('http://localhost:5000/')
            .its('__NEXT_DATA__.props.pageProps')
            .then((props: { data: WeatherResponse }) => {
                expect(props.data).to.haveOwnProperty('code');
                expect(props.data).to.haveOwnProperty('message');
                expect(props.data).to.haveOwnProperty('current');
                expect(props.data).to.haveOwnProperty('location');

                cy.get('input[type="text"]').should('have.value', 'New York');
                cy.get('div.card-title.h5').eq(1).should('contain', 'New York');

                cy.get('div.d-flex')
                    .find('p')
                    .eq(0)
                    .should('have.text', `Condition: ${props.data.current.condition.text}`);
                cy.get('div.d-flex')
                    .find('p')
                    .eq(1)
                    .should('have.text', `Temperature: ${props.data.current.temp_c}°C`);
                cy.get('div.d-flex')
                    .find('p')
                    .eq(2)
                    .should('have.text', `Feels like: ${props.data.current.feelslike_c}°C`);
                cy.get('div.d-flex')
                    .find('p')
                    .eq(3)
                    .should('have.text', `Humidity: ${props.data.current.humidity}%`);
                cy.get('div.d-flex')
                    .find('p')
                    .eq(4)
                    .should('have.text', `Wind: ${props.data.current.wind_kph} KM/H`);
                cy.get('div.d-flex')
                    .find('p')
                    .eq(5)
                    .should('have.text', `Wind direction: ${props.data.current.wind_dir}`);
                cy.get('div.d-flex')
                    .find('p')
                    .eq(6)
                    .should('have.text', `Pressure: ${props.data.current.pressure_mb}`);
                cy.get('div.d-flex')
                    .find('p')
                    .eq(7)
                    .should('have.text', `Visibility: ${props.data.current.vis_km} KM`);
            });
    });
    it('Should fetch new data', () => {
        cy.intercept('POST', 'http://localhost:5000/api/weather/current*').as('getWeather');

        cy.visit('http://localhost:5000/');

        cy.get('input[type="text"]').clear().type('Paris');
        cy.get('button[type="submit"]').should('have.text', 'Check weather').click();

        cy.wait('@getWeather');
        cy.get('div.card-title.h5').eq(1).should('contain', 'Paris');
    });
    it('Should add city to favourites', () => {
        cy.intercept('GET', 'http://localhost:5000/api/user/cities*', {
            code: 1, message: '', cities: []
        }).as('getCities')
        cy.intercept('POST', 'http://localhost:5000/api/user/cities*').as('addCity');

        cy.visit('http://localhost:5000/');

        cy.get('button[data-testid="add-fav-btn"]')
            .should('have.text', 'Add to favourites')
            .click();

        cy.wait('@addCity');
        cy.get('div.card-title.h5').last().should('have.text', 'Check weather in your favourite cities');

        cy.get('div.card-body').last().find('p').should('contain.text', 'New York');
    });
    it('Should remove city from favourites', () => {
        cy.intercept('GET', 'http://localhost:5000/api/user/cities*', {
            code: 1, message: '', cities: ['New York']
        }).as('getCities')
        cy.intercept('DELETE', 'http://localhost:5000/api/user/cities*').as('deleteCity');

        cy.visit('http://localhost:5000/');

        cy.get('button.btn-danger')
            .should('contain.text', 'Remove')
            .click();
        cy.wait('@deleteCity');
        cy.get('div.card-title.h5').last().should('have.text', 'New York - United States of America');
    });
});

after(() => localStorage.clear());