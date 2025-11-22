import { z as zod } from 'zod';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Upload } from 'src/components/upload';
import { createCourse, updateCourse } from 'src/store/slices/courseSlice';

// ----------------------------------------------------------------------

export const NewCourseSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().optional(),
  image: zod.string().optional(),
  freeOrPaid: zod.boolean().optional(),
  amount: zod.preprocess(
    (val) => {
      if (val === '' || val === undefined || val === null) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    zod.number().optional()
  ),
  level: zod.string(),
});

// ----------------------------------------------------------------------

export function CourseNewEditForm({ currentCourse }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [previewImage, setPreviewImage] = useState(currentCourse?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const defaultValues = useMemo(
    () => ({
      title: currentCourse?.title || '',
      description: currentCourse?.description || '',
      image: currentCourse?.image || '',
      freeOrPaid: currentCourse?.freeOrPaid ?? false,
      amount: currentCourse?.amount && currentCourse.amount > 0 ? currentCourse.amount : undefined,
      level: currentCourse?.level || 'Beginner',
    }),
    [currentCourse]
  );

  // Initialize preview image from currentCourse
  useEffect(() => {
    if (currentCourse?.image) {
      setPreviewImage(currentCourse.image);
    }
  }, [currentCourse]);

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewCourseSchema),
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

  const freeOrPaid = watch('freeOrPaid');

  // Clear amount when switching to free
  useEffect(() => {
    if (freeOrPaid === false) {
      setValue('amount', undefined, { shouldValidate: true });
    }
  }, [freeOrPaid, setValue]);

  // Reset form and preview when currentCourse changes
  useEffect(() => {
    if (currentCourse?.id) {
      const img = currentCourse.image || '';
      reset({
        title: currentCourse.title || '',
        description: currentCourse.description || '',
        image: img,
        freeOrPaid: currentCourse.freeOrPaid ?? false,
        amount: currentCourse.amount && currentCourse.amount > 0 ? currentCourse.amount : undefined,
        level: currentCourse.level || 'Beginner',
      });
      setPreviewImage(img || null);
      setSelectedFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCourse?.id, reset]);

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
      // Prepare course data (without image - image sent separately as file)
      const courseData = {
        title: data.title,
        description: data.description || undefined,
        freeOrPaid: data.freeOrPaid ?? false,
        amount: data.freeOrPaid && data.amount ? parseFloat(data.amount.toString()) : 0,
        level: data.level || 'Beginner',
      };

      // Send file separately (not base64)
      const imageFile = selectedFile || null;

      if (currentCourse) {
        await dispatch(updateCourse({
          id: currentCourse.id,
          courseData,
          imageFile
        })).unwrap();
        toast.success('Course updated successfully!');
      } else {
        await dispatch(createCourse({
          courseData,
          imageFile
        })).unwrap();
        toast.success('Course created successfully!');
      }
      router.push(paths.admin.course.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save course';
      toast.error(errorMessage);
      console.error('Error saving course:', error);
    }
  });

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
                  maxSize={5 * 1024 * 1024}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                  }}
                />
              </Box>

              <Field.Switch name="freeOrPaid" label="Paid Course" />

              {freeOrPaid && (
                <Field.Text
                  name="amount"
                  label="Amount"
                  type="number"
                  inputProps={{ step: '0.01', min: 0 }}
                />
              )}

              <Field.Select name="level" label="Level">
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Field.Select>
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
                        {currentCourse ? 'Update Course' : 'Create Course'}
                      </LoadingButton>

                      <Button
                        fullWidth
                        size="large"
                        color="inherit"
                        variant="outlined"
                        onClick={() => router.push(paths.admin.course.list)}
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

