import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Trackings from './trackings/Trackings';
import BeaconLogs from './beacon-logs/BeaconLogs';
import LayoutLogs from './layout-logs/LayoutLogs';


const Products = lazy(() => import('./products/Products'));
const Ads = lazy(() => import('./ads/Ads'));
const Shops = lazy(() => import('./shops/Shops'));
const RegionMapper = lazy(() => import('./region-mapper/RegionMapper'));
const LayoutManager = lazy(() => import('./layout-manager/LayoutManager'));
const BeaconManager = lazy(() => import('./beacon-manager/BeaconManager'));
const ProductTracking = lazy(() => import('./product-tracking/ProductTracking'));
const Devices = lazy(() => import('./devices/Devices'));
const Sessions = lazy(() => import('./session/Sessions'));
const InactiveSession = lazy(() => import('./inactive-session/Sessions'));
const Carts = lazy(() => import('./carts/Carts'));
const ECommerceAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    // {
    //   path: 'apps/e-commerce/stores',
    //   element: <Shops />,
    // },
    
    {
      path: 'apps/e-commerce/ads',
      element: <Ads />,
    },
    // {
    //   path: 'apps/e-commerce/beaconlogs/:storeId',
    //   element: <BeaconLogs />,
    // },
    // {
    //   path: 'apps/e-commerce/layoutlogs/:storeId',
    //   element: <LayoutLogs />,
    // },
    {
      path: 'apps/e-commerce/devices',
      element: <Devices />,
    },
    {
      path: 'apps/e-commerce/sessions/:deviceId',
      element: <Sessions />,
    },
    {
      path: 'apps/e-commerce/inactivesessions/:deviceId',
      element: <InactiveSession />,
    },
    {
      path: 'apps/e-commerce/products',
      element: <Products />,
    },
    {
      path: 'apps/e-commerce/carts',
      element: <Carts />,
    },
    {
      path: 'apps/e-commerce/trackings/:sessionId/:deviceId/:status',
      element: <Trackings />,
    },
   
    {
      path: 'apps/e-commerce',
      element: <Navigate to="carts" />,
    },

    {
      path: '/',
      element: <Navigate to="apps/e-commerce" />,
    },
    // {
    //   path: 'apps/region-mapper/:storeId/:layoutId/:action',
    //   element: <RegionMapper />,
    // },
    // {
    //   path: 'apps/layout-manager/:storeId',
    //   element: <LayoutManager />,
    // },
    // {
    //   path: 'apps/beacon-manager',
    //   element: <BeaconManager />,
    // },
    // {
    //   path: 'apps/product-tracking',
    //   element: <ProductTracking />,
    // },
   
 
      
  ],
};

export default ECommerceAppConfig;
