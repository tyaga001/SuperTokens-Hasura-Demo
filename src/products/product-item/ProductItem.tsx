/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React, {
  useState, useEffect, useRef, memo,
} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import {
  useMutation,
  gql,
} from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Product } from '../models/Product';
import useToast from '../../hooks/useToast';

const ADD_TO_WHISHLIST = gql`
 mutation($pid: Int!) {
  insert_user_whishlist(objects: {product_id: $pid}) {
    affected_rows
  }
}
`;

const REMOVE_FROM_WHISHLIST = gql`
mutation($pid: Int!) {
  delete_user_whishlist(where: {product_id: {_eq: $pid}}) {
    affected_rows
  }
}
`;
const useStyles: any = makeStyles(() => ({
  productImg: {
    height: '200px',
    width: '99px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  currencyTxt: {
    fontSize: '18px',
  },
  currIcon: {
    position: 'relative',
    top: '7px',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  productCard: {
    cursor: 'pointer',
  },
}));

const ProductItem = memo(({ productData }: {productData: Product}) => {
  const [addToWhishlist,
    { loading: whishlistLoading, error: whishlistError }] = useMutation(ADD_TO_WHISHLIST);
  const [removeFromWhishlist,
    { loading: removeLoading, error: removeError }] = useMutation(REMOVE_FROM_WHISHLIST);
  const {
    name, price, product_img_url, status,
  } = productData;
  const navigate = useNavigate();
  const [whishtlised, setWhishlisted] = useState(false);
  const { addToast } = useToast();
  const componentMounted = useRef(false);

  const addToWhishList = async () => {
    if (whishtlised) {
      await addToWhishlist({ variables: { pid: productData.id } });
      addToast('Added to your Whishlist');
    } else {
      await removeFromWhishlist({ variables: { pid: productData.id } });
      addToast('Removed from your Whishlist');
    }
  };

  useEffect(() => {
    if (componentMounted.current) {
      addToWhishList();
    }
  }, [whishtlised]);

  useEffect(() => {
    componentMounted.current = true;
    return () => {
      componentMounted.current = false;
    };
  }, []);

  const classes = useStyles();
  return (
    <Card className={classes.productCard} onClick={() => navigate(`/product/${productData.id}`)}>
      <CardHeader title={name} />
      <CardMedia
        className={classes.productImg}
        component="img"
        image={product_img_url}
        alt="Paella dish"
      />
      <CardContent>
        <Typography color="text.primary" className={classes.currencyTxt}>
          <CurrencyRupeeIcon className={classes.currIcon} />
          {price}
          {' '}
          {status}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            setWhishlisted((prev) => !prev);
          }}
          variant="outlined"
          startIcon={whishtlised ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
        >
          Add to whishlist
        </Button>
      </CardActions>
    </Card>
  );
});

export default ProductItem;
