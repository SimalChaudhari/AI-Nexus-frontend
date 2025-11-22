import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { useGetCourse } from 'src/actions/course';
import { LearningCourseDetailsView } from 'src/sections/learning/view/learning-course-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Course Details | ${CONFIG.site.name}` };

export default function LearningCourseDetailsPage() {
  const params = useParams();
  const { course, courseLoading, courseError } = useGetCourse(params.id);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <LearningCourseDetailsView course={course} loading={courseLoading} error={courseError} />
    </>
  );
}

