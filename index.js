'use strict';

const PRODUCTS_URL = 'products.json';
const CATEGORIES_URL = 'categories.json';
const WIDGET_ITEM_CARD = 'widget--item-card';
const WIDGET_CARD_TITLE = 'widget--item-card--title';
const WIDGET_CARD_IMG = 'widget--item-card--img';
const WIDGET_TAB = 'widget--item-tab--button';
const WIDGET_ACTIVE_TAB = 'widget--item-tab--button__active';
const WIDGET_LIST_ITEM = 'widget--item-tab';
const SRC = 'https://rrstatic.retailrocket.net/test_task/tovar.jpg';

const widgetTabs = document.querySelector('.widget--list-tabs');
const widgetCards = document.querySelector('.widget--list-cards');

let saveActiveTab;
let categories;
let products;

async function requestData(url) {
  let response = await fetch(url);
  if (response.ok) {
    return await response.json();
  }
}

function createTab(text, className, number) {
  const li = document.createElement('li');
  li.classList.add(WIDGET_LIST_ITEM);
  const button = document.createElement('button');
  button.classList.add(className);
  button.textContent = text;
  button.setAttribute('data-category-id', number);
  li.append(button);
  return li;
}

function createTabs(categories) {
  if (categories?.length) {
    const tabs = [];

    const categoriesSort = categories.sort((a, b) => {
      return a.categoryId - b.categoryId;
    });

    categoriesSort.forEach((obj) => {
      const tab = createTab(obj.categoryName, WIDGET_TAB, obj.categoryId);
      tabs.push(tab);
    });

    return tabs;
  }
}

function setActiveTab() {
  const activeTab = document.querySelector(`.${WIDGET_ACTIVE_TAB}`);
  activeTab?.classList.remove(WIDGET_ACTIVE_TAB);

  const targetTab = document.querySelector(`[data-category-id="${saveActiveTab}"]`);
  targetTab?.classList.add(WIDGET_ACTIVE_TAB);
}

function insertTabs(elem, tabs) {
  elem.append(...tabs);
}

function createCard(src, alt, text) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const h2 = document.createElement('h2');

  img.src = src;
  img.alt = alt;
  img.classList.add(WIDGET_CARD_IMG);

  h2.textContent = text;
  h2.classList.add(WIDGET_CARD_TITLE);

  li.classList.add(WIDGET_ITEM_CARD);
  li.append(img, h2);

  return li;
}

function createCards(products, tabActive) {
  if (products?.length) {
    const cards = [];

    products.forEach((obj) => {
      const {productName, categoryId} = obj;
      if (categoryId === Number(tabActive)) {
        const card = createCard(SRC, productName, productName);
        cards.push(card);
      }
    });
    return cards;
  }
}

function insertCards(elem, cards) {
  elem.append(...cards);
}

async function getData() {
  categories = await requestData(CATEGORIES_URL);
  saveActiveTab = categories[0].categoryId;
  insertTabs(widgetTabs, createTabs(categories));
  setActiveTab();

  products = await requestData(PRODUCTS_URL);
  insertCards(widgetCards, createCards(products, saveActiveTab));
}

getData();

widgetTabs.addEventListener('click', async (evt) => {
  const {target} = evt;
  const targetAttributeCategoryId = Number(target.dataset.categoryId);

  if (targetAttributeCategoryId !== saveActiveTab && 'categoryId' in target.dataset) {
    saveActiveTab = targetAttributeCategoryId;
    setActiveTab();
    widgetCards.innerHTML = '';
    insertCards(widgetCards, createCards(products, saveActiveTab));
  }
});
