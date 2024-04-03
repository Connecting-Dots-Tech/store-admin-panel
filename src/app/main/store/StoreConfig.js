import i18next from 'i18next';

import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import StorePage from './Store';

i18next.addResourceBundle('en', 'homePage', en);
i18next.addResourceBundle('tr', 'homePage', tr);
i18next.addResourceBundle('ar', 'homePage', ar);

const StoreConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'home',
      element: <StorePage />,
    },
  ],
};

export default StoreConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const Example = lazy(() => import('./Example'));

const ExampleConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'example',
      element: <Example />,
    },
  ],
};

export default ExampleConfig;
*/
