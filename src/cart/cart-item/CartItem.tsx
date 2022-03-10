import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import Button from '@mui/material/Button';
import {
  useMutation,
  gql,
} from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import { Product } from '../../products/models/Product';

const useStyles = makeStyles({
  productImage: {
    width: '56px',
    height: '112px',
  },
  producDetails: {
    display: 'flex',
    textAlign: 'left',
    padding: '15px',
  },
  imgWrapper: {
    width: '170px',
  },
  headerTxt: {
    fontSize: '18px',
    color: '#212121',
    lineHeight: '1',
    margin: '0',
    fontWeight: '400',
  },
  currIcon: {
    position: 'relative',
    top: '7px',
    fontWeight: 'bold',
    fontSize: '28px',
  },
  currencyTxt: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
});

const REMOVE_FROM_CART = gql`mutation removeFromCart($pid: Int!) {
  delete_user_cart(where: {product_id: {_eq: $pid}}) {
    affected_rows
  }
}
`;

export default function CartIem({ product, refereshCart }: {product: Product, refereshCart: any}) {
  const classes = useStyles();
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART);
  const handleRemove = async () => {
    await removeFromCart({
      variables: {
        pid: product.id,
      },
    });
    refereshCart();
  };
  return (
    <Box sx={{ borderBottom: '1px solid #efefef', padding: '16px' }}>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <div className={classes.producDetails}>
            <div className={classes.imgWrapper}>
              <img className={classes.productImage} alt="" src={product.product_img_url} />

            </div>
            <div>
              <p className={classes.headerTxt}>{product.name}</p>
              <p>
                <CurrencyRupeeIcon className={classes.currIcon} />
                <span className={classes.currencyTxt}>{product?.price}</span>
                <p>
                  <LoadingButton
                    sx={{ fontSize: '18px', fontWeight: 'bold' }}
                    onClick={handleRemove}
                    loading={loading}
                  >
                    REMOVE

                  </LoadingButton>
                </p>
              </p>
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          Delivery by Tue Mar 15
        </Grid>
      </Grid>
    </Box>
  );
}
