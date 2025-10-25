import { Container, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import MarketGallery from '@/components/Gallery/MarketGallery/MarketGallery';
import PageHero from '@/components/PageHero';
import { searchCopy } from '@/backend/api/copy';
import debounce from '@/utils/debounce';

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copies, setCopies] = useState<CreatedCopy[]>([]);
  const handleFoundCopies = (foundCopies: CreatedCopy[] | undefined) => {
    console.log('Found Copies for sale : ', foundCopies);
    setCopies(foundCopies ?? []);
  };
  const handleSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.trim() === '') {
          setCopies([]);
          return;
        }
        console.log(`searching : ${text}`);
        return searchCopy({ query: text, forSale: true }, handleFoundCopies);
      }),
    []
  );

  useEffect(() => {
    return handleSearch(searchQuery);
  }, [handleSearch, searchQuery]);

  return (
    <>
      <meta name="title" content="Market" />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <PageHero
            title="Market"
            description="Search the marketplace to discover copies currently listed for sale by the community."
          />
          <TextField
            placeholder="Search the marketplace"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            fullWidth
          />
          <MarketGallery copies={copies} />
        </Stack>
      </Container>
    </>
  );
};

export default MarketPage;
