import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { fetchCommunities, deleteCommunity } from 'src/store/slices/communitySlice';
import { fetchCategories } from 'src/store/slices/categorySlice';
import { CommunityTableRow } from '../community-table-row';
import { CommunityTableToolbar } from '../community-table-toolbar';
import { CommunityTableFiltersResult } from '../community-table-filters-result';

// ----------------------------------------------------------------------

const PRICING_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'pricingType', label: 'Pricing', width: 120 },
  { id: 'amount', label: 'Amount', width: 120 },
  { id: 'categories', label: 'Categories', width: 200 },
  { id: 'action', label: 'Action', width: 88 },
];

// ----------------------------------------------------------------------

export function CommunityListView() {
  const dispatch = useDispatch();
  const { communities: tableData, loading } = useSelector((state) => state.communities);
  const { categories } = useSelector((state) => state.categories);
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();

  const filters = useSetState({ name: '', pricingType: 'all', categoryIds: [] });

  // Fetch communities and categories from Redux store
  useEffect(() => {
    dispatch(fetchCommunities());
    dispatch(fetchCategories());
  }, [dispatch]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.name || filters.state.pricingType !== 'all' || (filters.state.categoryIds && filters.state.categoryIds.length > 0);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await dispatch(deleteCommunity(id)).unwrap();
        toast.success('Delete success!');
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        toast.error(error || 'Failed to delete community');
      }
    },
    [dataInPage.length, dispatch, table]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const deletePromises = table.selected.map((id) => dispatch(deleteCommunity(id)).unwrap());
      await Promise.all(deletePromises);
      toast.success('Delete success!');
      table.onUpdatePageDeleteRows({
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    } catch (error) {
      toast.error(error || 'Failed to delete communities');
    }
  }, [dataFiltered.length, dataInPage.length, dispatch, table]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.admin.community.edit(id));
    },
    [router]
  );

  const handleFilterPricingType = useCallback(
    (event, newValue) => {
      filters.setState({ pricingType: newValue });
      table.onResetPage();
    },
    [filters, table]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Community', href: paths.admin.community.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.community.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New community
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.pricingType}
            onChange={handleFilterPricingType}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {PRICING_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.pricingType) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'free' && 'success') ||
                      (tab.value === 'paid' && 'warning') ||
                      'default'
                    }
                  >
                    {tab.value === 'all'
                      ? tableData.length
                      : tableData.filter((community) => community.pricingType === tab.value).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <CommunityTableToolbar filters={filters} categories={categories} onResetPage={table.onResetPage} />

          {canReset && (
            <CommunityTableFiltersResult
              filters={filters}
              categories={categories}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <CommunityTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, pricingType, categoryIds } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Filter by name
  if (name) {
    inputData = inputData.filter(
      (community) =>
        community.title.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // Filter by pricing type
  if (pricingType && pricingType !== 'all') {
    inputData = inputData.filter(
      (community) => community.pricingType === pricingType
    );
  }

  // Filter by categories
  if (categoryIds && categoryIds.length > 0) {
    inputData = inputData.filter((community) => {
      // Check single category first, then fallback to categories array for backward compatibility
      const communityCategoryId = community.category?.id || community.categoryId ||
        (community.categories?.[0]?.id || community.categories?.[0]);
      return communityCategoryId && categoryIds.includes(communityCategoryId);
    });
  }

  return inputData;
}

