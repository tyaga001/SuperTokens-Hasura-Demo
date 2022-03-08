/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import {
  useQuery,
  gql,
} from '@apollo/client';
import Skeleton from '@mui/material/Skeleton';
import CartItem from '../cart-item/CartItem';
// import CardMedia from '@mui/material/CardMedia';
const PRODUCTS_IN_CART = gql`
query getProductsInCart {
  user_cart {
    cartProducts {
      category_id
      name
      price
      product_img_url
      status
    }
  }
}
`;
export default function CartList() {
  const { data, loading, error } = useQuery(PRODUCTS_IN_CART);
  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={6}>
        <Grid item xs={7}>
          <Card>
            {!loading ? (
              <>
                <CardHeader title="list" />
                <CardContent>
                  {data.user_cart.map((item: any) => <CartItem product={item.cartProducts} />)}
                </CardContent>
              </>
            ) : <Skeleton animation="wave" variant="rectangular" height="416px" />}
          </Card>
        </Grid>
        <Grid item xs={5}>
          <Card>
            {!loading ? <CardHeader title="Details" /> : <Skeleton animation="wave" variant="rectangular" height="416px" />}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
