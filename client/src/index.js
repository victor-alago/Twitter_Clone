import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './redux/store';

// persist from redux is used to prevent loss of authenticated user data when the page is refreshed.
import { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate> 
    </Provider>
  // </React.StrictMode>
);

