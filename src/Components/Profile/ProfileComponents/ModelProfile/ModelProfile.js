import React, {useState, useContext } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import '../ModelProfile/ModelProfile.css';
import { updateUserProfile } from '../../../../api';
import { AuthContext } from '../../../../index';

function ModelProfile({
  openEdit,
  setOpenEdit,
  handleModel,
  name,
  setName,
  userName,
  setUserName,
  countryName,
  setCountryName,
  jobName,
  setJobName,
}) {
  const { userId } = useContext(AuthContext);
  const theme = useMantineTheme();
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (name) formData.append('bio', name);
      if (countryName) formData.append('countryName', countryName);
      if (jobName) formData.append('jobName', jobName);
      await updateUserProfile(userId, formData);
      handleModel(e);
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to update profile');
    }
  };

  return (
    <Modal
      radius="8px"
      zIndex="1001"
      size="lg"
      opened={openEdit}
      title="Edit Info"
      onClose={() => setOpenEdit(false)}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
      }}
    >
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form className='modelForm' onSubmit={handleFormSubmit}>
        <div className="row1">
          <div className="inputBox1">
            <input
              type="text"
              name="name"
              id="name"
              placeholder='Enter Bio'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="inputBox1">
            <input
              type="text"
              name="username"
              id="username"
              placeholder='Enter Profile Tag'
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
          </div>
        </div>
        <div className="inputBox1">
          <input
            type="text"
            name="countryname"
            id="countryname"
            placeholder='Enter Country'
            onChange={(e) => setCountryName(e.target.value)}
            value={countryName}
          />
        </div>
        <div className="inputBox1">
          <input
            type="text"
            name="jobname"
            id="jobname"
            placeholder='Enter Job'
            onChange={(e) => setJobName(e.target.value)}
            value={jobName}
          />
        </div>
        <button className='modelBtn'>Update</button>
      </form>
    </Modal>
  );
}

export default ModelProfile;