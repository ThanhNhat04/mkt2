'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAdded';
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibrary';
import CourseWrapCoursePresent from '@/components/UI/(Course)/Course_sideBar/sever/Course_wrapCoursePresent';
import Nav from './sever/index';
import None from './sever/none';
import TextField from '@mui/material/TextField';
import Project_Create from '@/app/project/ui/Project_Create';

export default function CourseSideBar({ data = [], department, user, token }) {

  const [tabValue, setTabValue] = useState(0);
  const courseCounts = data ? data.reduce(
    (counts, e) => {
      counts.inProgress += 1;
      return counts;
    },
    { inProgress: 0, completed: 0, program: 0, review: 0 }
  ) : null
  const tabs = [
    {
      label: 'Dự án đang thực hiện',
      icon: <CollectionsBookmarkRoundedIcon />,
      count: data ? courseCounts.inProgress : 0,
      status: tabValue === 0,
      onClick: () => setTabValue(0),
      content: (
        <>
          {courseCounts ? courseCounts.inProgress ? (
            <CourseWrapCoursePresent data={data.filter((item) => !item.Status)} department={department} />
          ) : (
            <None />
          ) : (
            <None />
          )}
        </>
      ),
    },
    {
      label: 'Dự án hoàn thành',
      icon: <BookmarkAddedRoundedIcon />,
      count: data ? courseCounts.completed : 0,
      status: tabValue === 1,
      onClick: () => setTabValue(1),
      content: (
        <>
          {/* {data_book.allBook.length ? <SearchBar data_book={data_book} status={true} /> : <SearchBar data_book={data_book} status={false} />} */}
          {courseCounts ? courseCounts.completed ? (
            <CourseWrapCoursePresent
              data={data.filter(
                (item) => item.Status && item.Type === 'AI Robotic'
              )}
            />
          ) : (
            <None />
          ) : <None />}
        </>
      ),
    },
    {
      label: 'Dự án trễ',
      icon: <LocalLibraryRoundedIcon />,
      count: data ? courseCounts.program : 0,
      status: tabValue === 2,
      onClick: () => setTabValue(2),
      content: courseCounts ? courseCounts.program ? <>Có tồn tại</> : <None /> : <None />,
    },
    {
      label: 'Dự án trễ',
      icon: <LocalLibraryRoundedIcon />,
      count: data ? courseCounts.review : 0,
      status: tabValue === 3,
      onClick: () => setTabValue(3),
      content: (
        <>
          {/* {data_book.allBook.length ? <SearchBar data_book={data_book} status={true} /> : <SearchBar data_book={data_book} status={false} />} */}
          {courseCounts ? courseCounts.completed ? (
            <CourseWrapCoursePresent
              data={data.filter(
                (item) => item.Type === 'Trial Class'
              )}
            />
          ) : (
            <None />
          ) : (
            <None />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          p: 2,
          backgroundColor: 'white',
          mb: 2,
          height: '70px',
        }}
      >
        {tabs.map((tab, index) => (
          <Box key={index} onClick={tab.onClick} sx={{ flex: 1 }}>
            <Nav
              icon={tab.icon}
              title={tab.label}
              sl={tab.count}
              status={tab.status}
            />
          </Box>
        ))}
      </Box>
      <SearchBar data={data} department={department} user={user} token={token} />
      <Box
        sx={{
          height: 'calc(100% - 85px)',
        }}
      >
        {tabs[tabValue].content}
      </Box>
    </>
  );
}

function SearchBar({ data, department, user, token }) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        p: 2,
        backgroundColor: 'white',
        mb: 2,
        justifyContent: 'space-between',
      }}
    >
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        size="small"
        sx={{ mr: 2, width: '400px', color: 'var(--main)' }}
      />
      <Project_Create data={data} department={department} user={user} token={token} />
    </Box>
  );
}