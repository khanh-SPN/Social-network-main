export default function validation(data) {
  const error = {};

  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  const passwordPattern = /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,}$/;
  const profileTagPattern = /^@[a-zA-Z0-9_]{3,}$/;

  if (data.username && data.username === '') {
    error.username = '* Username is Required!';
  }

  if (data.email === '') {
    error.email = '* Email is Required';
  } else if (!emailPattern.test(data.email)) {
    error.email = '* Email did not match';
  }

  if (data.password === '') {
    error.password = '* Password is Required';
  } else if (!passwordPattern.test(data.password)) {
    error.password = '* Password must be at least 8 characters';
  }

  if (data.confirmpassword && data.confirmpassword === '') {
    error.confirmpassword = '* Confirm password is Required';
  } else if (data.confirmpassword && data.password !== data.confirmpassword) {
    error.confirmpassword = "* Confirm password didn't match";
  }

  if (data.profileTag && data.profileTag === '') {
    error.profileTag = '* Profile Tag is Required';
  } else if (data.profileTag && !profileTagPattern.test(data.profileTag)) {
    error.profileTag = '* Profile Tag must start with @ and be at least 3 characters';
  }

  return error;
}