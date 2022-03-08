import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  useQuery,
  gql,
} from '@apollo/client';
import Skeleton from '@mui/material/Skeleton';
import ProductItem from '../product-item/ProductItem';
import { Product } from '../models/Product';

const PRODUCT_LIST = gql`query{products {id category_id  merchant_id  name  price product_img_url status}}`;

function ProductList() {
  const { loading, error, data } = useQuery(PRODUCT_LIST);

  console.log('re render', error);
  return (
    <>
      {' '}
      {console.log('re render')}
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Grid container spacing={6}>
          {
           !loading ? data?.products?.map((product: Product) => (
             <Grid item xs={3}>
               <ProductItem productData={product} />
             </Grid>
           )) : <Grid item xs={3}><Skeleton variant="rectangular" width={210} height={118} /></Grid>
        }
        </Grid>
      </Box>
    </>
  );
}

export default ProductList;
