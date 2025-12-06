import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { createUser, updateUser } from 'src/store/slices/userSlice';
import { NewUserSchema, UpdateUserSchema, ProfileSchema } from 'src/validations/user.validation';

// ----------------------------------------------------------------------

// Helper function to normalize status to match validation schema
const normalizeStatus = (status) => {
  if (!status) return 'Active';
  const statusStr = String(status);
  // Capitalize first letter, rest lowercase
  return statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
};

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser, onCancel, onSuccess, isProfileEdit = false }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { creating, updating } = useSelector((state) => state.users || { creating: false, updating: false });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      email: currentUser?.email || '',
      status: normalizeStatus(currentUser?.status) || 'Active',
    }),
    [currentUser]
  );

  // For profile editing, use ProfileSchema (no status), otherwise use NewUserSchema
  const validationSchema = isProfileEdit ? ProfileSchema : NewUserSchema;

  const methods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
  } = methods;

  const values = watch();

  // Reset form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, reset, defaultValues]);

  // Use Redux loading state instead of form's isSubmitting
  const isSubmitting = currentUser ? updating : creating;

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        // Transform frontend data to backend format
        const backendData = {
          username: data.username?.trim(),
          firstname: data.firstname?.trim(),
          lastname: data.lastname?.trim(),
          email: data.email?.trim().toLowerCase(),
        };

        // Include status if not profile edit
        if (!isProfileEdit) {
          const normalizedStatus = normalizeStatus(data.status || 'Active');
          backendData.status = normalizedStatus.toLowerCase(); // Backend expects lowercase
        }

        if (currentUser) {
          // Get user ID - try both id and _id
          const userId = currentUser.id || currentUser._id;

          if (!userId) {
            toast.error('User ID is missing. Cannot update user.');
            console.error('Current user object:', currentUser);
            return;
          }

          // Update user
          const updatedUser = await dispatch(updateUser({ id: userId, userData: backendData })).unwrap();
          toast.success('User updated successfully!');

          // If onSuccess callback is provided, call it (for profile edit mode)
          if (onSuccess) {
            onSuccess(updatedUser);
          } else if (onCancel) {
            // If only onCancel is provided, just close edit mode
            onCancel();
          } else {
            // Otherwise navigate to list
            router.push(paths.admin.user.list);
          }
        } else {
          // Create user - password will be set by backend or default
          await dispatch(createUser(backendData)).unwrap();
          toast.success('User created successfully!');
          router.push(paths.admin.user.list);
        }
      } catch (error) {
        console.error('Error saving user:', error);
        const errorMessage = error?.message || error?.toString() || 'Failed to save user';
        toast.error(errorMessage);
      }
    },
    (errors) => {
      // Handle validation errors
      console.error('Form validation errors:', errors);
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message);
      } else {
        toast.error('Please fix the form errors before submitting');
      }
    }
  );

  // For profile edit, show simple form. For admin edit, show status card + details card
  if (isProfileEdit) {
    return (
      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Field.Text name="firstname" label="First Name" />
            <Field.Text name="lastname" label="Last Name" />
            <Field.Text name="username" label="Username" />
            <Field.Text name="email" label="Email" />
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            {onCancel && (
              <Button variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={onCancel}>
                Cancel
              </Button>
            )}
            <LoadingButton type="submit" variant="contained" loading={isSubmitting} startIcon={<Iconify icon="eva:checkmark-fill" />}>
              {!currentUser ? 'Create user' : 'Save changes'}
            </LoadingButton>
          </Stack>
        </Card>
      </Form>
    );
  }

  // Admin edit form with status card on left and details on right
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Status Card - Left Side */}
        {currentUser && (
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 5, pb: 5, px: 3, position: 'relative' }}>
              <Label
                color={
                  (values.status === 'Active' && 'success') ||
                  (values.status === 'Banned' && 'error') ||
                  (values.status === 'Inactive' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>

              <Stack spacing={3}>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Active'}
                          onChange={(event) => field.onChange(event.target.checked ? 'Active' : field.value)}
                        />
                      )}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Active
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User account is active
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />

                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Inactive'}
                          onChange={(event) => field.onChange(event.target.checked ? 'Inactive' : 'Active')}
                        />
                      )}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Inactive
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User account is inactive
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />

                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Pending'}
                          onChange={(event) => field.onChange(event.target.checked ? 'Pending' : 'Active')}
                        />
                      )}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Pending
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User account is pending verification
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />

                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Banned'}
                          onChange={(event) => field.onChange(event.target.checked ? 'Banned' : 'Active')}
                        />
                      )}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />
              </Stack>
            </Card>
          </Grid>
        )}

        {/* User Details Card - Right Side */}
        <Grid xs={12} md={currentUser ? 8 : 12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="username" label="Username" />
              <Field.Text name="email" label="Email address" />
              <Field.Text name="firstname" label="First name" />
              <Field.Text name="lastname" label="Last name" />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
              {onCancel && (
                <Button variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} startIcon={<Iconify icon="eva:checkmark-fill" />}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
