describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.setCookie('accessToken', 'test-token');
    cy.visit('/');
  });

  it('Добавляет ингредиенты в конструктор', () => {
    cy.contains('Краторная булка').click({ force: true });
    cy.contains('Биокотлета').click({ force: true });
    cy.get('button').contains('Оформить заказ').should('not.be.disabled');
  });

  it('Открывает и закрывает модальное окно ингредиента', () => {
    cy.contains('Краторная булка').click({ force: true });
    cy.url().should('include', '/ingredients/');
    cy.get('body').type('{esc}');
    cy.url().should('not.include', '/ingredients/');
  });

  it('Создает заказ', () => {
    cy.intercept('POST', '**/api/orders', {
      body: {
        success: true,
        order: { number: 12345 }
      }
    });

    cy.contains('Краторная булка').click({ force: true });
    cy.contains('Биокотлета').click({ force: true });
    cy.get('button').contains('Оформить заказ').click({ force: true });
    cy.wait(1000);
  });
});
