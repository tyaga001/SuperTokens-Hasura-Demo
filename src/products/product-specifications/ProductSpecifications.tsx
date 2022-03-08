import React from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles(() => ({
  specHeader: {
    fontSize: '24px',
    fontWeight: '500',
    lineHeight: '1.14',
    textAlign: 'left',
    color: '#212121',
  },
  specSubHeader: {
    fontSize: '18px',
    lineHeight: '1.43',
    textAlign: 'left',
  },
  specContent: {
    textAlign: 'left',
    color: '#878787',
    fontWeight: '400',
    padding: '5px 0',
  },
  specContentRight: {
    textAlign: 'left',
    fontWeight: '400',
    padding: '5px 0',
  },
}));

export default function ProductSpecifications({ specs, header }: {specs: any, header: string}) {
  const classes = useStyles();
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <p className={classes.specSubHeader}>{header}</p>
        </Grid>
        {specs && Object.entries(specs).map(([key, value]: any) => (
          <>
            <Grid item xs={3}>
              <div className={classes.specContent}>{key}</div>
            </Grid>
            <Grid item xs={9}>
              <div className={classes.specContentRight}>{value}</div>
            </Grid>
          </>
        ))}
      </Grid>
    </div>
  );
}
