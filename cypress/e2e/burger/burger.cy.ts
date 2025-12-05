describe('Конструктор бургеров', () => {
  const CONSTRUCTOR_ELEMENT = '[class*="constructor-element"]';
  const CONSTRUCTOR_TOP = '[class*="constructor-element_pos_top"]';
  const CONSTRUCTOR_BOTTOM = '[class*="constructor-element_pos_bottom"]';
  const IMAGE = 'img[alt="изображение ингредиента."]';
  const ADD_BUTTON = 'button:contains("Добавить")';
  const ORDER_BUTTON = 'button:contains("Оформить заказ")';
  // Селекторы для модальных окон
  const MODAL_TITLE = 'h3[class*="text_type_main-medium"]';
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.setCookie('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.visit('/');
  });

  it('Добавляет ингредиенты в конструктор', () => {
    // Добавляем булку
    cy.contains('Краторная булка')
      .parent()
      .within(() => {
        cy.get(ADD_BUTTON).should('be.visible').click();
      });
    // Проверяем, что булка добавилась в конструктор (верхняя)
    cy.get(CONSTRUCTOR_TOP).contains('Краторная булка').should('exist');
    // Проверяем, что булка добавилась в конструктор (нижняя)
    cy.get(CONSTRUCTOR_BOTTOM).contains('Краторная булка').should('exist');

    // Добавляем начинку
    cy.contains('Биокотлета')
      .parent()
      .within(() => {
        cy.get(ADD_BUTTON).should('be.visible').click();
      });
    // Проверяем, что начинка добавилась в конструктор
    cy.get(CONSTRUCTOR_ELEMENT)
      .not(CONSTRUCTOR_TOP)
      .not(CONSTRUCTOR_BOTTOM)
      .contains('Биокотлета')
      .should('exist');
    // Проверяем активность кнопки заказа
    cy.get(ORDER_BUTTON).should('not.be.disabled');
  });

  it('Открывает и закрывает модальное окно ингредиента', () => {
    // Кликаем на название ингредиента чтобы открыть модальное окно
    cy.contains('Краторная булка').click({ force: true });
    // Ждем загрузки модального окна
    cy.wait(1000);
    // Проверяем содержимое модального окна
    cy.get(IMAGE).should('be.visible');
    cy.get(MODAL_TITLE).contains('Краторная булка').should('be.visible');
    cy.contains('Калории, ккал').should('be.visible');
    cy.contains('Белки, г').should('be.visible');
    cy.contains('Жиры, г').should('be.visible');
    cy.contains('Углеводы, г').should('be.visible');
    cy.contains('420').should('exist');
    cy.contains('80').should('exist');
    cy.contains('24').should('exist');
    cy.contains('53').should('exist');
    // Закрываем модальное окно через ESC
    cy.get('body').type('{esc}');
    // Проверяем, что модальное окно закрылось
    cy.contains('Краторная булка').should('be.visible');
    cy.get(IMAGE).should('not.exist');
  });

  it('Создает заказ', () => {
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');
    // Добавляем булку
    cy.contains('Краторная булка')
      .parent()
      .within(() => {
        cy.get(ADD_BUTTON).click();
      });
    // Добавляем начинку
    cy.contains('Биокотлета')
      .parent()
      .within(() => {
        cy.get(ADD_BUTTON).click();
      });
    // Проверяем, что кнопка оформления заказа активна
    cy.get(ORDER_BUTTON).should('not.be.disabled').and('be.visible');
    // Нажимаем кнопку оформления заказа
    cy.get(ORDER_BUTTON).click();
    // Ждем запроса на создание заказа
    cy.wait('@createOrder', { timeout: 10000 });
  });
});
