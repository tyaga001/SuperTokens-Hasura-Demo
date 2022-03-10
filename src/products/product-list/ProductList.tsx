import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  useQuery,
  gql,
} from '@apollo/client';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import ProductItem from '../product-item/ProductItem';
import { Product } from '../models/Product';
import useToast from '../../hooks/useToast';

const PRODUCT_LIST = gql`query{products {id category_id  merchant_id  name  price product_img_url status}user_whishlist {
    product_id
  }}`;

function ProductList() {
  const { loading, error, data } = useQuery(PRODUCT_LIST);
  const { addToast } = useToast();
  if (error) {
    addToast('Unable to load.....');
    return null;
  }
  return (
    <Box sx={{ flexGrow: 1, padding: '20px' }}>
      <Grid container spacing={6}>
        {
           !loading ? data?.products?.map((product: Product) => (
             <Grid item xs={3}>
               <ProductItem
                 productData={product}
                 whishlisted={data?.user_whishlist
                   .some((item: any) => item.product_id === product.id)}
               />
             </Grid>
           )) : (
             <Grid item xs={3}>
               <Card style={{ padding: '10px' }}>
                 <Skeleton variant="rectangular" height={50} style={{ marginBottom: '10px' }} />
                 <Skeleton variant="rectangular" height={200} style={{ marginBottom: '10px' }} />
                 <Skeleton variant="rectangular" height={40} width={100} style={{ margin: '0 auto' }} />
               </Card>
             </Grid>
           )
        }
      </Grid>
    </Box>
  );
}

export default ProductList;
