import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ShoppingCartTable from '@/components/Table/ShoppingCartTable';
import PageHero from '@/components/PageHero';

const CartPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={{ xs: 4, md: 5 }}>
        <PageHero
          title="Cart"
          description="Review the items you are ready to purchase and adjust quantities before checking out."
        />
        <Typography variant="h6" component="h2">
          Items in your cart
        </Typography>
        <ShoppingCartTable />
      </Stack>
    </Container>
  );
};

export default CartPage;
