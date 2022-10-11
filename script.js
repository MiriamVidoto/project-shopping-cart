const itemsShowcase = document.querySelector('.items');
const list = document.querySelector('.cart__items');
const priceTotal = document.querySelector('.total-price');
const saves = [];

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  );
  return section;
};

const loading = () => {
  const loadingText = createCustomElement('span', 'loading', 'loading...');
  itemsShowcase.appendChild(loadingText);
};

const removeLoading = () => {
  const loadingMessage = document.querySelector('.loading');
  loadingMessage.remove();
};

const showcase = async () => {
  loading();
  const resultApi = await fetchProducts('computador');
  removeLoading();
  resultApi.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const products = createProductItemElement({ sku, name, image });
    itemsShowcase.appendChild(products);
  });
};

const getSkuFromProductItem = (item) =>
  item.querySelector('span.item__sku').innerText;

const sumPrices = () => {
  const arrayPrices = [];
  const itemsCart = document.querySelectorAll('.cart__item');
  itemsCart.forEach((item) =>
    arrayPrices.push(Number(item.innerText.split('$')[1]))
  );
  const sum = arrayPrices.reduce((acc, crr) => acc + crr, 0);
  if (sum === 0) {
    return '';
  }
  return `R$ ${sum.toFixed(2)}`;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  priceTotal.innerText = sumPrices();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addItemToCart = async (event) => {
  const item = event.target.parentElement;
  const id = getSkuFromProductItem(item);
  const selected = await fetchItem(id);
  const data = { sku: id, name: selected.title, salePrice: selected.price };
  const element = createCartItemElement(data);
  list.appendChild(element);
  saves.push(data);
  saveCartItems(JSON.stringify(saves));
  priceTotal.innerText = sumPrices();
};

const buttonsListener = () => {
  document
    .querySelectorAll('.item')
    .forEach((btn) => btn.addEventListener('click', addItemToCart));
};

const getIntemsLocalstorage = () => {
  if (localStorage.getItem('cartItems') !== null) {
    const save = getSavedCartItems();
    const itemsLocalstorage = JSON.parse(save);
    const arr = [...itemsLocalstorage];
    arr.forEach((el) => {
      const element = createCartItemElement(el);
      list.appendChild(element);
    });
    priceTotal.innerText = sumPrices();
  }
};

document.querySelector('.empty-cart').addEventListener('click', () => {
  localStorage.clear();
  list.innerHTML = '';
  priceTotal.innerText = sumPrices();
});

const start = async () => {
  await showcase();
  buttonsListener();
  getIntemsLocalstorage();
};

window.onload = () => start();
