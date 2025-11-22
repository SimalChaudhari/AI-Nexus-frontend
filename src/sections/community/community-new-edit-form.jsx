import { z as zod } from 'zod';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Chip, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Upload } from 'src/components/upload';
import { createCommunity, updateCommunity } from 'src/store/slices/communitySlice';
import { fetchCategories } from 'src/store/slices/categorySlice';

// ----------------------------------------------------------------------

export const NewCommunitySchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().optional(),
  smallImage: zod.string().optional(),
  largeImage: zod.string().optional(),
  pricingType: zod.boolean().optional(),
  amount: zod.preprocess(
    (val) => {
      if (val === '' || val === undefined || val === null) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    zod.number().optional()
  ),
  categoryId: zod
    .union([
      zod.string(),
      zod.object({
        id: zod.string(),
        label: zod.string(),
      }),
    ])
    .optional()
    .nullable(),
});

// ----------------------------------------------------------------------

export function CommunityNewEditForm({ currentCommunity }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories } = useSelector((state) => state.categories);

  const [previewSmallImage, setPreviewSmallImage] = useState(currentCommunity?.smallImage || null);
  const [selectedSmallFile, setSelectedSmallFile] = useState(null);
  const [previewLargeImage, setPreviewLargeImage] = useState(currentCommunity?.largeImage || null);
  const [selectedLargeFile, setSelectedLargeFile] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      title: currentCommunity?.title || '',
      description: currentCommunity?.description || '',
      smallImage: currentCommunity?.smallImage || '',
      largeImage: currentCommunity?.largeImage || '',
      pricingType: currentCommunity?.pricingType === 'paid' || false,
      amount: currentCommunity?.amount && currentCommunity.amount > 0 ? currentCommunity.amount : undefined,
      categoryId: null, // Will be set in useEffect after categories load
    }),
    [currentCommunity]
  );

  // Initialize preview images from currentCommunity base64 strings
  useEffect(() => {
    if (currentCommunity?.smallImage) {
      setPreviewSmallImage(currentCommunity.smallImage);
    }
    if (currentCommunity?.largeImage) {
      setPreviewLargeImage(currentCommunity.largeImage);
    }
  }, [currentCommunity]);

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewCommunitySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  // Set category value when categories are loaded or currentCommunity changes
  useEffect(() => {
    if (currentCommunity && categories.length > 0) {
      const categoryOption = currentCommunity?.category
        ? { id: currentCommunity.category.id, label: currentCommunity.category.title }
        : currentCommunity?.categoryId
        ? (() => {
            const found = categories.find((cat) => cat.id === currentCommunity.categoryId);
            return found ? { id: found.id, label: found.title } : null;
          })()
        : null;

      if (categoryOption) {
        setValue('categoryId', categoryOption, { shouldValidate: false });
      }
    }
  }, [currentCommunity, categories, setValue]);

  const pricingType = watch('pricingType');
  const categoryValue = watch('categoryId');
  const smallImageValue = watch('smallImage');
  const largeImageValue = watch('largeImage');

  // Clear amount when switching to free
  useEffect(() => {
    if (pricingType === false) {
      setValue('amount', undefined, { shouldValidate: true });
    }
  }, [pricingType, setValue]);

  // Reset form and preview when currentCommunity changes
  useEffect(() => {
    if (currentCommunity?.id) {
      const smallImg = currentCommunity.smallImage || '';
      const largeImg = currentCommunity.largeImage || '';

      reset({
        title: currentCommunity.title || '',
        description: currentCommunity.description || '',
        smallImage: '', // Not stored in form, only in preview
        largeImage: '', // Not stored in form, only in preview
        pricingType: currentCommunity.pricingType === 'paid' || false,
        amount: currentCommunity.amount && currentCommunity.amount > 0 ? currentCommunity.amount : undefined,
        categoryId: currentCommunity?.category
          ? { id: currentCommunity.category.id, label: currentCommunity.category.title }
          : currentCommunity?.categoryId && categories.length > 0
          ? (() => {
              const found = categories.find((cat) => cat.id === currentCommunity.categoryId);
              return found ? { id: found.id, label: found.title } : null;
            })()
          : null,
      });
      // Set preview from base64 strings (if they exist)
      setPreviewSmallImage(smallImg || null);
      setPreviewLargeImage(largeImg || null);
      setSelectedSmallFile(null);
      setSelectedLargeFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCommunity?.id, reset]);

  // Handle small image drop - store file for upload (not base64)
  const handleDropSmallImage = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create preview for display (base64 for preview only)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result; // For preview only
        setPreviewSmallImage(base64String);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file); // For preview only

      // Store the actual file for upload
      setSelectedSmallFile(file);
    },
    []
  );

  // Handle large image drop - store file for upload (not base64)
  const handleDropLargeImage = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create preview for display (base64 for preview only)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result; // For preview only
        setPreviewLargeImage(base64String);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file); // For preview only

      // Store the actual file for upload
      setSelectedLargeFile(file);
    },
    []
  );

  // Handle small image delete
  const handleDeleteSmallImage = useCallback(() => {
    setPreviewSmallImage(null);
    setSelectedSmallFile(null);
  }, []);

  // Handle large image delete
  const handleDeleteLargeImage = useCallback(() => {
    setPreviewLargeImage(null);
    setSelectedLargeFile(null);
  }, []);

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        // Prepare community data (without images - images sent separately as files)
        const communityData = {
          title: data.title,
          description: data.description || undefined,
          pricingType: data.pricingType ? 'paid' : 'free',
          amount: data.pricingType && data.amount ? parseFloat(data.amount.toString()) : 0,
          categoryId: data.categoryId?.id || data.categoryId || undefined,
        };

        // If pricing is free, ensure amount is 0
        if (!data.pricingType) {
          communityData.amount = 0;
        }

        // Send files separately (not base64)
        const smallImageFile = selectedSmallFile || null;
        const largeImageFile = selectedLargeFile || null;

        if (currentCommunity) {
          const result = await dispatch(updateCommunity({
            id: currentCommunity.id,
            communityData,
            smallImageFile,
            largeImageFile,
          })).unwrap();
          toast.success('Community updated successfully!');
          router.push(paths.admin.community.list);
        } else {
          const result = await dispatch(createCommunity({
            communityData,
            smallImageFile,
            largeImageFile,
          })).unwrap();
          toast.success('Community created successfully!');
          router.push(paths.admin.community.list);
        }
      } catch (error) {
        console.error('Error saving community - full error:', error);
        const errorMessage = error?.message || error?.response?.data?.message || error?.toString() || 'Failed to save community';
        toast.error(errorMessage);
      }
    },
    (errors) => {
      // Handle validation errors
      console.error('Form validation errors:', errors);
      toast.error('Please fix the form errors before submitting');
    }
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="title" label="Title" />

              <Field.Text name="description" label="Description" multiline rows={4} />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Small Image
                </Typography>
                <Upload
                  value={selectedSmallFile || previewSmallImage}
                  onDrop={handleDropSmallImage}
                  onDelete={handleDeleteSmallImage}
                  maxSize={5 * 1024 * 1024}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Large Image
                </Typography>
                <Upload
                  value={selectedLargeFile || previewLargeImage}
                  onDrop={handleDropLargeImage}
                  onDelete={handleDeleteLargeImage}
                  maxSize={5 * 1024 * 1024}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                  }}
                />
              </Box>

              <Field.Switch name="pricingType" label="Paid Community" />

              {pricingType && (
                <Field.Text
                  name="amount"
                  label="Amount"
                  type="number"
                  inputProps={{ step: '0.01', min: 0 }}
                />
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Category
                </Typography>
                <Field.Autocomplete
                  name="categoryId"
                  placeholder="Select category..."
                  options={categories.map((category) => ({ id: category.id, label: category.title }))}
                  getOptionLabel={(option) => {
                    if (!option) return '';
                    if (typeof option === 'string') return option;
                    return option.label || '';
                  }}
                  isOptionEqualToValue={(option, value) => {
                    if (!option || !value) return false;
                    return option.id === value.id;
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.label}
                    </li>
                  )}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Box
            sx={{
              position: { md: 'sticky' },
              top: { md: 100 },
              alignSelf: { md: 'flex-start' },
            }}
          >
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <Stack spacing={1.5}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        fullWidth
                        size="large"
                      >
                        {!currentCommunity ? 'Create Community' : 'Update Community'}
                      </LoadingButton>

                      <Button
                        fullWidth
                        size="large"
                        color="inherit"
                        variant="outlined"
                        onClick={() => router.push(paths.admin.community.list)}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}

