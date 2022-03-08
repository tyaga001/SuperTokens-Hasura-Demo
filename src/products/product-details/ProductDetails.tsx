/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { makeStyles } from '@mui/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  useQuery,
  gql,
  useMutation,
} from '@apollo/client';
import CardActions from '@mui/material/CardActions';
import LoadingButton from '@mui/lab/LoadingButton';
import Skeleton from '@mui/material/Skeleton';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useParams, useNavigate } from 'react-router-dom';
import ProductSpecifications from '../product-specifications/ProductSpecifications';

const FETCH_PRODUCT = gql`query getProduct($pid: Int!) {
  products(where: {id: {_eq: $pid}}) {
    category_id
    id
    merchant_id
    name
    price
    product_img_url
    status
    descriptions
  }
}
`;

const ADD_TO_CART = gql`mutation addToCart($pid: Int!) {
  insert_user_cart_one(object: {product_id: $pid}) {
    product_id
  }
}
`;

const useStyles: any = makeStyles(() => ({
  productImg: {
    height: '416px',
    width: '200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px',
  },
  addtoCartBtn: {
    backgroundColor: '#ff9f00',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  buyNowBtn: {
    backgroundColor: '#fb641b',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  textLeft: {
    textAlign: 'left',
  },
  offerHeader: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#212121',
    textAlign: 'left',
  },
  offerList: {
    textAlign: 'left',
    lineHeight: '1.43',
    paddingLeft: '0',
  },
  specHeader: {
    fontSize: '24px',
    fontWeight: '500',
    lineHeight: '1.14',
    textAlign: 'left',
    color: '#212121',
  },
  cardWrapper: {
    padding: '20px',
  },
  currencyTxt: {
    fontSize: '28px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  offerImg: {
    height: '18px',
    width: '18px',
    position: 'relative',
    top: '6px',
    marginRight: '10px',
  },
  offerListWrapper: {
    listStyle: 'none',
  },
  pb0: {
    paddingBottom: '0',
  },
  currIcon: {
    position: 'relative',
    top: '5px',
    fontWeight: 'bold',
    fontSize: '28px',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  productCard: {
    cursor: 'pointer',
  },
}));

export default function ProductDetails() {
  const { pid } = useParams();
  const { loading, data, error } = useQuery(FETCH_PRODUCT, {
    variables: {
      pid,
    },
  });
  const [addToCart, {
    loading: AddLoader,
    data: AddData, error: AddError,
  }] = useMutation(ADD_TO_CART);
  const product = data?.products[0];
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const classes = useStyles();
  const cartBtnTxt = useRef('ADD TO CART');
  const navigate = useNavigate();

  const addToCartHandler = async () => {
    cartBtnTxt.current = 'GOIN TO CART';
    setAddToCartLoader(true);
    await addToCart({
      variables: {
        pid,
      },
    });
    navigate('/cart');
  };
  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <Card className={classes.cardWrapper}>
            {!loading ? (
              <CardMedia
                className={classes.productImg}
                component="img"
                image={product.product_img_url}
                alt="Paella dish"
              />
            ) : <Skeleton animation="wave" variant="rectangular" height="416px" />}
            <CardActions className={classes.cardActions}>
              {!loading ? (
                <>
                  <LoadingButton
                    variant="contained"
                    disableElevation
                    size="large"
                    loading={addToCartLoader}
                    loadingPosition="start"
                    className={classes.addtoCartBtn}
                    startIcon={<AddShoppingCartIcon />}
                    onClick={addToCartHandler}
                  >
                    {cartBtnTxt.current}
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    disableElevation
                    size="large"
                    className={classes.buyNowBtn}
                  >
                    BUY NOW
                  </LoadingButton>
                </>
              ) : (
                <>
                  <Skeleton animation="wave" variant="rectangular" height="43px" width="190px" />
                  <Skeleton animation="wave" variant="rectangular" height="43px" width="190px" />
                </>
              )}
            </CardActions>
          </Card>

        </Grid>
        <Grid item xs={8}>
          <Card>
            {!loading ? <CardHeader className={`${classes.textLeft} ${classes.pb0}`} title={product.name} /> : <Skeleton animation="wave" variant="rectangular" height="43px" />}
            <CardContent className={classes.pb0}>
              {!loading ? (
                <>
                  <Typography color="text.primary" className={classes.currencyTxt}>
                    <CurrencyRupeeIcon className={classes.currIcon} />
                    {product?.price}
                  </Typography>
                  {product?.descriptions?.offers?.length > 0 && (
                  <div className={classes.offers}>
                    <p className={classes.offerHeader}>Available Offers</p>
                    <ul className={classes.offerList}>
                      {
                            product?.descriptions?.offers.map((item: string) => (
                              <li className={classes.offerListWrapper}>
                                <span><img className={classes.offerImg} alt="" src="/images/offer.png" /></span>
                                {item}
                              </li>
                            ))
                        }
                    </ul>
                  </div>
                  ) }
                  <div>
                    <p className={classes.specHeader}>Specifications</p>
                    <ProductSpecifications header="General" specs={product?.descriptions?.specifications?.general} />
                    <ProductSpecifications header="Display Features" specs={product?.descriptions?.specifications?.display} />
                  </div>
                </>
              ) : <Skeleton animation="wave" variant="rectangular" height="43px" width="190px" />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
