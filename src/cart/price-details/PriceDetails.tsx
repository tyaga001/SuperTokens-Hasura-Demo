import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  detailsHeader: {
    fontSize: '24px',
    fontWeight: '500',
    textAlign: 'left',
    color: '#878787',
    borderBottom: '1px solid #efefef',
    padding: '16px',
  },
  prcieWrapper: {
    display: 'flex',

  },
  priceContent: {
    width: '50%',
    padding: '16px',
    textAlign: 'left',
    fontSize: '22px',
  },
});

export default function PriceDetails({ priceDetails }: { priceDetails: any}) {
  const classes = useStyles();
  const total = priceDetails.reduce((prev: any, curr: any) => ({
    price: prev.price + curr.price,
    discount: prev.discount + curr.discount,
  }));
  console.log(total);
  return (
    <div>
      <div className={classes.detailsHeader}>
        PRICE DETAILS
      </div>
      <div className={classes.prcieWrapper}>
        <div className={classes.priceContent}>Price</div>
        <div className={classes.priceContent}>{total.price}</div>
      </div>
      <div className={classes.prcieWrapper}>
        <div className={classes.priceContent}>Discount</div>
        <div className={classes.priceContent}>
          -
          {total.discount}
        </div>
      </div>
      <div className={classes.prcieWrapper}>
        <div className={classes.priceContent}>Delivery Charges</div>
        <div className={classes.priceContent}>-</div>
      </div>
      <div className={classes.prcieWrapper}>
        <div className={classes.priceContent}>Total Amount</div>
        <div className={classes.priceContent}>
          {Number(total.price)
        - Number(total.discount)}

        </div>
      </div>
    </div>
  );
}
