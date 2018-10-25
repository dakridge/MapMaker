// dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// get our store
import createStore from './Store';

import App from './App';

// create our redux instance
const store = createStore();

// ReactDOM.render(
//     <Provider store={store}>
//         <App />
//     </Provider>,
//     document.getElementById('root'),
// );

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
