import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

import { fileIcon, imageIcon, audioIcon } from '../../../assets/icons';
import { getS3File } from '../../../api/entries';

const File = ({ file }) => {
  const [fileWithUrl, setFileWithUrl] = useState(null);

  useEffect(() => {
    const getFileWithUrl = async (file) => {
      const res = await getS3File(file.name);
      setFileWithUrl({ ...file, ...res });
    };

    const result = getFileWithUrl(file);
  }, []);

  const renderFileIcon = () => {
    if (file.type === 'application/pdf') {
      return (
        <>
          <SvgIcon fontSize="large">{fileIcon}</SvgIcon>
        </>
      );
    } else if (file.type.includes('image')) {
      return <SvgIcon fontSize="large">{imageIcon}</SvgIcon>;
    } else if (file.type === 'audio/mpeg') {
      return <SvgIcon fontSize="large">{audioIcon}</SvgIcon>;
    }
    return;
  };

  return (
    <>
      {!!fileWithUrl && (
        <a href={fileWithUrl.url} target="_blank" rel="noreferrer">
          <Stack
            direction="row"
            spacing={1}
            key={fileWithUrl.id}
            alignItems="center"
          >
            {renderFileIcon()}
            {console.log(fileWithUrl)}
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                width: '50%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {fileWithUrl.name}
            </Typography>
          </Stack>
        </a>
      )}
    </>
  );
};

File.propTypes = {
  file: PropTypes.object,
};

export default File;
