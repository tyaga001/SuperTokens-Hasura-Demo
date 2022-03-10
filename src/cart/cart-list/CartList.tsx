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
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CartItem from '../cart-item/CartItem';
import PriceDetails from '../price-details/PriceDetails';
// import CardMedia from '@mui/material/CardMedia';
const PRODUCTS_IN_CART = gql`query getProductsInCart {
  user_cart {
    cartProducts {
      category_id
      name
      price
      product_img_url
      id
    }
    price
    discount
  }
  
}

`;
export default function CartList() {
  const {
    data, loading, error, refetch,
  } = useQuery(PRODUCTS_IN_CART);
  const navigate = useNavigate();

  const refereshCart = () => {
    refetch();
  };
  if (!loading && data.user_cart.length === 0) {
    return (
      <Box>
        <Card>
          <CardHeader sx={{ textAlign: 'left', paddingLeft: '33px' }} title="My Cart" />
          <CardContent>
            <img style={{ height: '162px' }} alt="" src="/images/empty.png" />
            <p>Your Cart is empty</p>
            <Button variant="contained" onClick={() => navigate('/home')}>Shop Now</Button>
          </CardContent>
        </Card>
      </Box>
    );
  }
  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={6}>
        <Grid item xs={7}>
          <Card>
            {!loading ? (
              <>
                <CardHeader sx={{ borderBottom: '1px solid #efefef', textAlign: 'left', paddingLeft: '33px' }} title={`My Cart (${data.user_cart.length})`} />
                <CardContent sx={{ padding: '0' }}>
                  {data.user_cart.map((item: any) => (
                    <CartItem
                      refereshCart={refereshCart}
                      product={item.cartProducts}
                    />
                  ))}
                </CardContent>
              </>
            ) : <Skeleton animation="wave" variant="rectangular" height="416px" />}
          </Card>
        </Grid>
        <Grid item xs={5}>
          <Card>
            {!loading ? (
              <CardContent sx={{ padding: '0' }}>
                <PriceDetails priceDetails={data.user_cart} />
              </CardContent>
            ) : <Skeleton animation="wave" variant="rectangular" height="416px" />}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
