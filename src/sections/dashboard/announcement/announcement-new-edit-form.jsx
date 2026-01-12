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
import { createAnnouncement, updateAnnouncement } from 'src/store/slices/announcementSlice';

// ----------------------------------------------------------------------

export const NewAnnouncementSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
});

// ----------------------------------------------------------------------

export function AnnouncementNewEditForm({ currentAnnouncement }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: currentAnnouncement?.title || '',
      description: currentAnnouncement?.description || '',
    }),
    [currentAnnouncement]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewAnnouncementSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const announcementData = {
        title: data.title,
        description: data.description,
      };

      if (currentAnnouncement) {
        await dispatch(updateAnnouncement({ id: currentAnnouncement.id, announcementData })).unwrap();
        toast.success('Announcement updated successfully!');
      } else {
        await dispatch(createAnnouncement(announcementData)).unwrap();
        toast.success('Announcement created successfully!');
      }
      router.push(paths.admin.announcement.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save announcement';
      toast.error(errorMessage);
      console.error('Error saving announcement:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="title" label="Title" />

              <Field.Text
                name="description"
                label="Description"
                multiline
                rows={6}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack direction="row" spacing={1.5} sx={{ position: 'sticky', top: 24 }}>
            <Button fullWidth color="inherit" variant="outlined" size="large" onClick={() => router.back()}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} fullWidth>
              {!currentAnnouncement ? 'Create' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
