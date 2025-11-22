import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { createTag, updateTag } from 'src/store/slices/tagSlice';

// ----------------------------------------------------------------------

export const NewTagSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
});

// ----------------------------------------------------------------------

export function TagNewEditForm({ currentTag }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: currentTag?.title || '',
    }),
    [currentTag]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewTagSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const tagData = {
        title: data.title,
      };

      if (currentTag) {
        await dispatch(updateTag({ id: currentTag.id, tagData })).unwrap();
        toast.success('Tag updated successfully!');
      } else {
        await dispatch(createTag(tagData)).unwrap();
        toast.success('Tag created successfully!');
      }
      router.push(paths.admin.tag.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save tag';
      toast.error(errorMessage);
      console.error('Error saving tag:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="title" label="Title" />
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
                {!currentTag ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}

