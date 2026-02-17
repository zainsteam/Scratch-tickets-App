import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://admin.scratchticketgenie.us/api';

// Function to log in the user
export const loginUser = async (
  email: any,
  password: any,
  mobileToken: any = 'fsdfsdfdsfsdfsd',
) => {
  const url = `${BASE_URL}/auth/login?email=${encodeURIComponent(
    email,
  )}&password=${encodeURIComponent(password)}&mobile_token=${encodeURIComponent(
    mobileToken,
  )}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
    });

    const data = await response.json();

    if (response.ok) {
      // Save token or user data in AsyncStorage if needed
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.customer));

      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (name: any, email: any, password: any) => {
  const url = `${BASE_URL}/auth/register?name=${encodeURIComponent(
    name,
  )}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(
    password,
  )}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
    });

    const data = await response.json();

    if (response.ok) {
      // Save token or user data in AsyncStorage if needed
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data));

      return data;
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error) {
    console.log(error, 'error');
    throw error;
  }
};

// fetch top tickets
export const fetchTopTickets = async (stateName: any, type: any) => {
  // console.log(type, 'state');
  let selectedType = '';
  if (type == 'Top 10') {
    selectedType = 'top';
  } else if (type == 'Newest') {
    selectedType = 'newly';
  } else {
    selectedType = 'grand-prize';
  }

  try {
    const response = await fetch(
      `${BASE_URL}/tickets/${selectedType}?state_name=${stateName}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Uncomment if needed
        },
      },
    );

    const data = await response.json();

    // 🔹 BUSINESS 404 (No tickets)
    if (response.status === 404) {
      return {
        success: false,
        empty: true,
        status: 404,
        message: data.message,
        description: data.description,
        state: data.state,
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not in JSON format.');
    }

    // const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('API fetch error:', error);
    return error; // Return an empty array to prevent crashes
  }
};

// disable ads
export const disableAds = async (
  customerId: any,
  title: any,
  message: any,
  image: any,
) => {
  // console.log(
  //   customerId,
  //   'customer ',
  //   title,
  //   'ttile ',
  //   message,
  //   'message ',
  //   image,
  //   'image ',
  // );
  try {
    const response = await fetch(`${BASE_URL}/ad-disable-requests`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
        title: title,
        message: message,
        image: image,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error disabling ads:', error);
    throw error;
  }
};

// update profile
export const updateProfile = async (userData: any) => {
  try {
    // console.log(userData, 'user');
    const response = await fetch(`${BASE_URL}/customer/update-profile`, {
      method: 'POST', // Use POST method
      headers: {
        'Content-Type': 'application/json', // Set content type
      },
      body: JSON.stringify(userData), // Send data in body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    await AsyncStorage.setItem('userData', JSON.stringify(data.customer));
    return data; // Return API response data
  } catch (error: any) {
    // console.error('Error updating profile:', error.message);
    throw error; // Throw error to be handled in the component
  }
};

// fetch states
export const fetchStates = async () => {
  try {
    const response = await fetch(`${BASE_URL}/states`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Return the list of states
  } catch (error) {
    // console.error('Error fetching states:', error);
    return []; // Return an empty array to prevent crashes
  }
};

// Function to call forgot password API
export const forgotPassword = async (email: any) => {
  const url = `${BASE_URL}/auth/forgot-password?email=${encodeURIComponent(
    email,
  )}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Reset link sent to your email.',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to send reset email.',
      };
    }
  } catch (error) {
    return {success: false, message: 'Something went wrong. Please try again.'};
  }
};

// reset password

export const resetPassword = async (
  email: any,
  token: any,
  newPassword: any,
) => {
  // console.log(email, ' ', token, ' ', newPassword);
  const url = `${BASE_URL}/auth/reset-password-app?email=${encodeURIComponent(
    email,
  )}&otp=${encodeURIComponent(token)}&password=${encodeURIComponent(
    newPassword,
  )}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Password has been reset successfully.',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to reset password.',
      };
    }
  } catch (error) {
    // console.log(error);
    return {success: false, message: 'Something went wrong. Please try again.'};
  }
};
