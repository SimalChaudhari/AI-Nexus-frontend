import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function CommunityTableFiltersResult({ filters, categories = [], onResetPage, totalResults, sx }) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemovePricingType = useCallback(() => {
    onResetPage();
    filters.setState({ pricingType: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveCategory = useCallback(
    (inputValue) => {
      const newValue = filters.state.categoryIds?.filter((item) => item !== inputValue) || [];

      onResetPage();
      filters.setState({ categoryIds: newValue });
    },
    [filters, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Pricing:" isShow={filters.state.pricingType !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.pricingType}
          onDelete={handleRemovePricingType}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Categories:" isShow={!!(filters.state.categoryIds && filters.state.categoryIds.length)}>
        {filters.state.categoryIds?.map((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          return (
            <Chip
              {...chipProps}
              key={categoryId}
              label={category?.title || categoryId}
              onDelete={() => handleRemoveCategory(categoryId)}
            />
          );
        })}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
