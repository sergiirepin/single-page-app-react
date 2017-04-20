import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PRODUCTS from '../data/products.json';
import './index.css';

ReactDOM.render(
  <App products={PRODUCTS} />,
  document.querySelector('.root')
);