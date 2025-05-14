import { Modal, useMantineTheme } from '@mantine/core';
import '../ModelProfile/ModelProfile.css';
import { updateUser } from '../../../../api'; // Sửa đường dẫn: từ src/Components/Profile/ProfileComponents/ModelProfile/ lên src/

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
  const theme = useMantineTheme();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.id;

      const updateData = {
        bio: name,
        countryName,
        jobName,
      };
      await updateUser(userId, updateData);
      handleModel(e); // Gọi hàm gốc để cập nhật state
    } catch (err) {
      console.error(err.response?.data?.msg || 'Failed to update profile');
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
      <form className='modelForm' onSubmit={handleFormSubmit}>
        <div className="row1">
          <div className="inputBox1">
            <input
              type="text"
              name="name"
              id="name"
              placeholder='Enter Name'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="inputBox1">
            <input
              type="text"
              name="username"
              id="username"
              placeholder='Enter User Name'
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              required
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
            required
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
            required
          />
        </div>
        <button className='modelBtn'>Update</button>
      </form>
    </Modal>
  );
}

export default ModelProfile;