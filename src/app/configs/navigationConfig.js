import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [

  {
    id: 'apps',
    title: 'Manage',
    subtitle: 'Store and Product management',
    type: 'collapse',
    icon: 'heroicons-outline:cube',
    translate: 'Manage',
    children: [
    
  
          
          {
            id: 'e-commerce-store',
            title: 'Products',
            type: 'item',
            url: 'apps/e-commerce/products',
            end: true,
          },
          {
            id: 'e-commerce-store',
            title: 'Devices',
            type: 'item',
            url: 'apps/e-commerce/devices',
            end: true,
          },
          {
            id: 'e-commerce-store',
            title: 'Ads',
            type: 'item',
            url: 'apps/e-commerce/ads',
            end: true,
          },
          // {
          //   id: 'product-tracking',
          //   title: "Product Tracking",
          //   type: 'item',
          //   url: 'apps/product-tracking',
          //   end: true,
          // },
           {
                      id: 'view-carts',
                      title: "View Carts",
                      type: 'item',
                      url: 'apps/e-commerce/carts',
                      end: true,
                    },
       
    ]
  },
   
 
];

export default navigationConfig;
