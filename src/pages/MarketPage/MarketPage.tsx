import { Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getCopiesForSale, searchCopy, type GetCopiesForSaleParams } from '@/backend/api/copy';
import MarketGallery from '@/components/Gallery/MarketGallery/MarketGallery';
import PageHero from '@/components/PageHero';
import { CopyConditionOptions } from '@/components/Forms/Fields/Select/CopyConditionSelect/CopyConditionSelect';
import { CurrencySelectOptions } from '@/components/Forms/Fields/Select/CurrencySelect/CurrencySelect';
import debounce from '@/utils/debounce';

const DEFAULT_MARKET_FILTERS: GetCopiesForSaleParams = {
  limit: 20,
  order: 'DESC',
};

const ORDER_OPTIONS = [
  { value: 'DESC', label: 'Newest first' },
  { value: 'ASC', label: 'Oldest first' },
] as const;

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copies, setCopies] = useState<CreatedCopy[]>([]);
  const [filters, setFilters] = useState<GetCopiesForSaleParams>({ ...DEFAULT_MARKET_FILTERS });

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
      limit: filters.limit ?? DEFAULT_MARKET_FILTERS.limit,
      order: filters.order ?? DEFAULT_MARKET_FILTERS.order,
    };

    if (filters.offset !== undefined) {
      nextFilters.offset = filters.offset;
    }
    if (filters.copyCondition) {
      nextFilters.copyCondition = filters.copyCondition;
    }
    if (filters.minPrice !== undefined) {
      nextFilters.minPrice = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      nextFilters.maxPrice = filters.maxPrice;
    }
    if (filters.currency) {
      nextFilters.currency = filters.currency;
    }

    const trimmedPublisher = filters.titlePublisher?.trim();
    if (trimmedPublisher) {
      nextFilters.titlePublisher = trimmedPublisher;
    }
    const trimmedTitle = filters.titleName?.trim();
    if (trimmedTitle) {
      nextFilters.titleName = trimmedTitle;
    }
    const trimmedIsbn = filters.titleIsbn?.trim();
    if (trimmedIsbn) {
      nextFilters.titleIsbn = trimmedIsbn;
    }

    return nextFilters;
  }, [filters]);

  const hasCustomFilters = useMemo(() => {
    if ((filters.limit ?? DEFAULT_MARKET_FILTERS.limit) !== DEFAULT_MARKET_FILTERS.limit) {
      return true;
    }
    if ((filters.order ?? DEFAULT_MARKET_FILTERS.order) !== DEFAULT_MARKET_FILTERS.order) {
      return true;
    }
    if (filters.offset !== undefined) {
      return true;
    }
    if (filters.copyCondition) {
      return true;
    }
    if (filters.minPrice !== undefined) {
      return true;
    }
    if (filters.maxPrice !== undefined) {
      return true;
    }
    if (filters.currency) {
      return true;
    }
    if (filters.titlePublisher && filters.titlePublisher.trim() !== '') {
      return true;
    }
    if (filters.titleName && filters.titleName.trim() !== '') {
      return true;
    }
    if (filters.titleIsbn && filters.titleIsbn.trim() !== '') {
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
    setFilters({ ...DEFAULT_MARKET_FILTERS });
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
          <TextField
            placeholder="Search the marketplace"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            fullWidth
          />
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
            <Stack spacing={{ xs: 2.5, md: 3 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1.5, sm: 2 }}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
              >
                <Typography variant="h6">Filter copies for sale</Typography>
                <Button onClick={handleResetFilters} disabled={!hasCustomFilters} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                  Reset filters
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Maximum results"
                  type="number"
                  value={filters.limit ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilters((previous) => ({
                      ...previous,
                      limit: value === '' ? undefined : Number(value),
                    }));
                  }}
                  inputProps={{ min: 1, max: 50, step: 1 }}
                  fullWidth
                />
                <TextField
                  label="Skip results"
                  type="number"
                  value={filters.offset ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilters((previous) => ({
                      ...previous,
                      offset: value === '' ? undefined : Number(value),
                    }));
                  }}
                  inputProps={{ min: 0, step: 1 }}
                  fullWidth
                />
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
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
                <TextField
                  label="ISBN"
                  value={filters.titleIsbn ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilters((previous) => ({
                      ...previous,
                      titleIsbn: value === '' ? undefined : value,
                    }));
                  }}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Minimum price (cents)"
                  type="number"
                  value={filters.minPrice ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilters((previous) => ({
                      ...previous,
                      minPrice: value === '' ? undefined : Number(value),
                    }));
                  }}
                  inputProps={{ min: 0, step: 1 }}
                  helperText="Provide values in cents"
                  fullWidth
                />
                <TextField
                  label="Maximum price (cents)"
                  type="number"
                  value={filters.maxPrice ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilters((previous) => ({
                      ...previous,
                      maxPrice: value === '' ? undefined : Number(value),
                    }));
                  }}
                  inputProps={{ min: 0, step: 1 }}
                  helperText="Provide values in cents"
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Title name"
                  value={filters.titleName ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilters((previous) => ({
                      ...previous,
                      titleName: value === '' ? undefined : value,
                    }));
                  }}
                  fullWidth
                />
                <TextField
                  label="Publisher"
                  value={filters.titlePublisher ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilters((previous) => ({
                      ...previous,
                      titlePublisher: value === '' ? undefined : value,
                    }));
                  }}
                  fullWidth
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Filters apply to the latest marketplace listings. Enter a search query to explore every copy regardless of the
                selected filters.
              </Typography>
            </Stack>
          </Paper>
          <MarketGallery copies={copies} />
        </Stack>
      </Container>
    </>
  );
};

export default MarketPage;
