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
import { createLabel, updateLabel } from 'src/store/slices/labelSlice';

// ----------------------------------------------------------------------

export const NewLabelSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
});

// ----------------------------------------------------------------------

export function LabelNewEditForm({ currentLabel }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: currentLabel?.title || currentLabel?.name || '',
    }),
    [currentLabel]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewLabelSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const labelData = {
        title: data.title,
      };

      if (currentLabel) {
        await dispatch(updateLabel({ id: currentLabel.id, labelData })).unwrap();
        toast.success('Label updated successfully!');
      } else {
        await dispatch(createLabel(labelData)).unwrap();
        toast.success('Label created successfully!');
      }
      router.push(paths.admin.label.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save label';
      toast.error(errorMessage);
      console.error('Error saving label:', error);
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
                {!currentLabel ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}

