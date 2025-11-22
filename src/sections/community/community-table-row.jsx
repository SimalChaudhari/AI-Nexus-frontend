import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function CommunityTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const router = useRouter();
  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            {row.smallImage ? (
              <Avatar
                alt={row.title}
                src={row.smallImage}
                variant="rounded"
                sx={{ width: 48, height: 48 }}
              />
            ) : (
              <Avatar variant="rounded" sx={{ width: 48, height: 48 }}>
                {row.title?.[0]?.toUpperCase()}
              </Avatar>
            )}

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={paths.admin.community.details(row.id)}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.title}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                {row.category?.title || row.categories?.[0]?.title || '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <Chip
            label={row.pricingType || 'free'}
            color={row.pricingType === 'paid' ? 'primary' : 'success'}
            size="small"
          />
        </TableCell>

        <TableCell>
          {row.pricingType === 'paid' && row.amount ? `$${parseFloat(row.amount).toFixed(2)}` : 'Free'}
        </TableCell>

        <TableCell>
          {row.category ? (
            <Chip
              label={row.category.title || row.category}
              size="small"
              variant="outlined"
            />
          ) : row.categories?.[0] ? (
            <Chip
              label={row.categories[0].title || row.categories[0]}
              size="small"
              variant="outlined"
            />
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              router.push(paths.admin.community.details(row.id));
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

