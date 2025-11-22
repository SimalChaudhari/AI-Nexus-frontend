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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Upload } from 'src/components/upload';
import { createWorkflow, updateWorkflow } from 'src/store/slices/workflowSlice';
import { fetchLabels } from 'src/store/slices/labelSlice';
import { fetchTags } from 'src/store/slices/tagSlice';

// ----------------------------------------------------------------------

export const NewWorkflowSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().optional(),
  labelId: zod.string().optional().nullable(),
  tags: zod.array(zod.any()).optional(),
  tagIds: zod.array(zod.string()).optional(),
});

// ----------------------------------------------------------------------

export function WorkflowNewEditForm({ currentWorkflow }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { labels } = useSelector((state) => state.labels);
  const { tags, loading: tagsLoading } = useSelector((state) => state.tags);

  const [previewImage, setPreviewImage] = useState(currentWorkflow?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch labels and tags
  useEffect(() => {
    dispatch(fetchLabels());
    dispatch(fetchTags());
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      title: currentWorkflow?.title || '',
      description: currentWorkflow?.description || '',
      labelId: currentWorkflow?.labelId || currentWorkflow?.label?.id || null,
      tagIds: currentWorkflow?.tagIds || currentWorkflow?.tags?.map((tag) => tag.id) || [],
    }),
    [currentWorkflow]
  );

  // Initialize preview image from currentWorkflow
  useEffect(() => {
    if (currentWorkflow?.image) {
      setPreviewImage(currentWorkflow.image);
    }
  }, [currentWorkflow]);

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewWorkflowSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Reset form and preview when currentWorkflow changes
  useEffect(() => {
    if (currentWorkflow?.id) {
      const img = currentWorkflow.image || '';
      reset({
        title: currentWorkflow.title || '',
        description: currentWorkflow.description || '',
        labelId: currentWorkflow.labelId || currentWorkflow.label?.id || null,
        tags: currentWorkflow.tags?.map((tag) => ({
          id: tag.id,
          label: tag.title,
          title: tag.title,
        })) || [],
        tagIds: currentWorkflow.tagIds || currentWorkflow.tags?.map((tag) => tag.id) || [],
      });
      setPreviewImage(img || null);
      setSelectedFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkflow?.id, reset]);

  // Handle image drop - store file for upload (not base64)
  const handleDropImage = useCallback(
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
        setPreviewImage(base64String);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file); // For preview only

      // Store the actual file for upload
      setSelectedFile(file);
    },
    []
  );

  // Handle image delete
  const handleDeleteImage = useCallback(() => {
    setPreviewImage(null);
    setSelectedFile(null);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Separate existing tags (with IDs) and new tags (strings)
      let tagIds = [];
      const tagTitles = [];

      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => {
          if (typeof tag === 'string') {
            // New tag - send title to backend
            tagTitles.push(tag.trim());
          } else if (tag.id) {
            // Existing tag - send ID to backend
            tagIds.push(tag.id);
          }
        });
      } else if (data.tagIds && data.tagIds.length > 0) {
        // Fallback to tagIds if tags array is not available
        tagIds = [...data.tagIds];
      }

      // Prepare workflow data (without image - image sent separately as file)
      const workflowData = {
        title: data.title,
        description: data.description || undefined,
        labelId: data.labelId || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        tagTitles: tagTitles.length > 0 ? tagTitles : undefined,
      };

      // Send file separately (not base64)
      const imageFile = selectedFile || null;

      if (currentWorkflow) {
        await dispatch(updateWorkflow({
          id: currentWorkflow.id,
          workflowData,
          imageFile
        })).unwrap();
        toast.success('Workflow updated successfully!');
      } else {
        await dispatch(createWorkflow({
          workflowData,
          imageFile
        })).unwrap();
        toast.success('Workflow created successfully!');
      }
      router.push(paths.admin.workflow.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save workflow';
      toast.error(errorMessage);
      console.error('Error saving workflow:', error);
    }
  });

  // Transform labels for autocomplete
  const labelOptions = useMemo(
    () =>
      labels.map((label) => ({
        id: label.id,
        label: label.name || label.title,
      })),
    [labels]
  );

  // Transform tags for autocomplete
  const tagOptions = useMemo(
    () =>
      tags.map((tag) => ({
        id: tag.id,
        label: tag.title,
      })),
    [tags]
  );

  // Get selected label value
  const selectedLabel = useMemo(() => {
    const labelId = watch('labelId');
    if (!labelId) return null;
    return labelOptions.find((opt) => opt.id === labelId) || null;
  }, [watch('labelId'), labelOptions]);

  // Get selected tags values
  const selectedTags = useMemo(() => {
    const tagIds = watch('tagIds') || [];
    return tagOptions.filter((opt) => tagIds.includes(opt.id));
  }, [watch('tagIds'), tagOptions]);


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
                  Image
                </Typography>
                <Upload
                  value={selectedFile || previewImage}
                  onDrop={handleDropImage}
                  onDelete={handleDeleteImage}
                  thumbnail
                />
              </Box>

              <Field.Autocomplete
                name="labelId"
                label="Label"
                placeholder="Select label..."
                options={labelOptions}
                value={selectedLabel}
                onChange={(event, newValue) => {
                  setValue('labelId', newValue?.id || null, { shouldValidate: true });
                }}
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

              <Field.TagsInput
                name="tags"
                label="Tags"
                placeholder="Add tag... (Press Enter to add, will be created on save)"
                options={tagOptions}
                loading={tagsLoading}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 100 }, alignSelf: { md: 'flex-start' } }}>
            <Stack direction="row" spacing={1.5}>
              <Button fullWidth color="inherit" variant="outlined" size="large" onClick={() => router.back()}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} fullWidth>
                {!currentWorkflow ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}

