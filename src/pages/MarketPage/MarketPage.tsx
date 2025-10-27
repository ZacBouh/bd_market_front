import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getCopiesForSale, searchCopy, type GetCopiesForSaleParams } from '@/backend/api/copy';
import MarketGallery from '@/components/Gallery/MarketGallery/MarketGallery';
import PageHero from '@/components/PageHero';
import { CopyConditionOptions } from '@/components/Forms/Fields/Select/CopyConditionSelect/CopyConditionSelect';
import { CurrencySelectOptions } from '@/components/Forms/Fields/Select/CurrencySelect/CurrencySelect';
import debounce from '@/utils/debounce';

const DEFAULT_MARKET_FILTERS: Pick<GetCopiesForSaleParams, 'limit' | 'order'> = {
  limit: 20,
  order: 'DESC',
};

type MarketFilterForm = {
  order?: GetCopiesForSaleParams['order'];
  copyCondition?: GetCopiesForSaleParams['copyCondition'];
  minPrice?: string;
  maxPrice?: string;
  currency?: GetCopiesForSaleParams['currency'];
};

const ORDER_OPTIONS = [
  { value: 'DESC', label: 'Newest first' },
  { value: 'ASC', label: 'Oldest first' },
] as const;

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copies, setCopies] = useState<CreatedCopy[]>([]);
  const [filters, setFilters] = useState<MarketFilterForm>({
    order: DEFAULT_MARKET_FILTERS.order,
  });
  const [showFilters, setShowFilters] = useState(false);

  const copyConditionOptions = useMemo(
    () => Object.entries(CopyConditionOptions) as Array<[keyof typeof CopyConditionOptions, string]>,
    [],
  );
  const currencyOptions = useMemo(
    () => Object.entries(CurrencySelectOptions) as Array<[keyof typeof CurrencySelectOptions, string]>,
    [],
  );

  const handleFoundCopies = useCallback((foundCopies: CreatedCopy[] | undefined) => {
    console.log('Found Copies for sale : ', foundCopies);
    setCopies(foundCopies ?? []);
  }, []);

  const handleSearch = useMemo(
    () =>
      debounce((text: string) => {
        const trimmedText = text.trim();
        if (trimmedText === '') {
          return;
        }
        console.log(`searching : ${trimmedText}`);
        return searchCopy({ query: trimmedText, forSale: true }, handleFoundCopies);
      }),
    [handleFoundCopies],
  );

  const sanitizedFilters = useMemo<GetCopiesForSaleParams>(() => {
    const nextFilters: GetCopiesForSaleParams = {
      limit: DEFAULT_MARKET_FILTERS.limit,
      order: filters.order ?? DEFAULT_MARKET_FILTERS.order,
    };

    if (filters.copyCondition) {
      nextFilters.copyCondition = filters.copyCondition;
    }
    if (filters.minPrice !== undefined && filters.minPrice.trim() !== '') {
      const parsedMinPrice = Number.parseFloat(filters.minPrice);
      if (!Number.isNaN(parsedMinPrice)) {
        nextFilters.minPrice = Math.round(parsedMinPrice * 100);
      }
    }
    if (filters.maxPrice !== undefined && filters.maxPrice.trim() !== '') {
      const parsedMaxPrice = Number.parseFloat(filters.maxPrice);
      if (!Number.isNaN(parsedMaxPrice)) {
        nextFilters.maxPrice = Math.round(parsedMaxPrice * 100);
      }
    }
    if (filters.currency) {
      nextFilters.currency = filters.currency;
    }

    return nextFilters;
  }, [filters]);

  const hasCustomFilters = useMemo(() => {
    if ((filters.order ?? DEFAULT_MARKET_FILTERS.order) !== DEFAULT_MARKET_FILTERS.order) {
      return true;
    }
    if (filters.copyCondition) {
      return true;
    }
    if (filters.minPrice && filters.minPrice.trim() !== '') {
      return true;
    }
    if (filters.maxPrice && filters.maxPrice.trim() !== '') {
      return true;
    }
    if (filters.currency) {
      return true;
    }
    return false;
  }, [filters]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== '') {
      return;
    }
    setCopies([]);
    const abort = getCopiesForSale(sanitizedFilters, handleFoundCopies);
    return abort;
  }, [handleFoundCopies, sanitizedFilters, searchQuery]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === '') {
      return;
    }
    return handleSearch(trimmedQuery);
  }, [handleSearch, searchQuery]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      order: DEFAULT_MARKET_FILTERS.order,
    });
  }, []);

  return (
    <>
      <meta name="title" content="Market" />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <PageHero
            title="Market"
            description="Search the marketplace to discover copies currently listed for sale by the community."
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }} alignItems={{ sm: 'center' }}>
            <TextField
              placeholder="Search the marketplace"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              fullWidth
            />
            <Button
              startIcon={<FilterListIcon />}
              variant={showFilters || hasCustomFilters ? 'contained' : 'outlined'}
              onClick={() => setShowFilters((previous) => !previous)}
            >
              {hasCustomFilters ? 'Filters applied' : 'Filters'}
            </Button>
          </Stack>
          {(showFilters || hasCustomFilters) && (
            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
              <Stack spacing={{ xs: 2.5, md: 3 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1.5, sm: 2 }}
                  alignItems={{ sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Typography variant="h6">Filter copies for sale</Typography>
                  <Button
                    onClick={handleResetFilters}
                    disabled={!hasCustomFilters}
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                  >
                    Reset filters
                  </Button>
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    select
                    label="Order"
                    value={filters.order ?? DEFAULT_MARKET_FILTERS.order}
                    onChange={(event) => {
                      const value = event.target.value as (typeof ORDER_OPTIONS)[number]['value'];
                      setFilters((previous) => ({
                        ...previous,
                        order: value,
                      }));
                    }}
                    fullWidth
                  >
                    {ORDER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Condition"
                    value={filters.copyCondition ?? ''}
                    onChange={(event) => {
                      const value = event.target.value as (typeof copyConditionOptions)[number][0] | '';
                      setFilters((previous) => ({
                        ...previous,
                        copyCondition: value === '' ? undefined : value,
                      }));
                    }}
                    fullWidth
                  >
                    <MenuItem value="">Any condition</MenuItem>
                    {copyConditionOptions.map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Minimum price"
                    type="number"
                    value={filters.minPrice ?? ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((previous) => ({
                        ...previous,
                        minPrice: value === '' ? undefined : value,
                      }));
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                  />
                  <TextField
                    label="Maximum price"
                    type="number"
                    value={filters.maxPrice ?? ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((previous) => ({
                        ...previous,
                        maxPrice: value === '' ? undefined : value,
                      }));
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Currency"
                    value={filters.currency ?? ''}
                    onChange={(event) => {
                      const value = event.target.value as (typeof currencyOptions)[number][0] | '';
                      setFilters((previous) => ({
                        ...previous,
                        currency: value === '' ? undefined : value,
                      }));
                    }}
                    fullWidth
                  >
                    <MenuItem value="">Any currency</MenuItem>
                    {currencyOptions.map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {value === 'euro' ? `Euro (${label})` : label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Filters apply to the latest marketplace listings. Enter a search query to explore every copy regardless of the
                  selected filters.
                </Typography>
              </Stack>
            </Paper>
          )}
          <MarketGallery copies={copies} />
        </Stack>
      </Container>
    </>
  );
};

export default MarketPage;
