import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase/firebaseConfig';
import Message from './components/Message';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthenticator, SwitchField, SelectField, Text, Button, Flex } from '@aws-amplify/ui-react';
import { patch } from '@aws-amplify/api-rest';
import { fetchAuthSession } from 'aws-amplify/auth';
import React from 'react';



interface ApiError extends Error {
  response: {
    body: string;
  };
}

function Home() {

  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const initialValues = {
    city: "3656",
    frequency: "rate(15 minute)",
    optOut: false
  };
  const [city, setCity] = React.useState(initialValues.city);
  const [frequency, setFrequency] = React.useState(initialValues.frequency);
  const [optOut, setOptOut] = React.useState(initialValues.optOut);

  async function requestPermission() {

    const permission = await Notification.requestPermission();
  
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_MESSAGING_VAPID_KEY,
      });
      await updateDeviceToken(token);
      console.log('Token generated : ', token);
    } else if (permission === 'denied') {
      alert('You denied for the notification');
    }
  }

  async function updateDeviceToken(deviceToken: string): Promise<void> {
    try {
      const user = await fetchAuthSession();
      const token = user.tokens?.idToken?.toString();
      const restOperation = await patch({
        apiName: 'climapushApi',
        path: '/users/devicetoken',
        options: {
          body: {
            deviceToken
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      console.log(restOperation.response);
    } catch (e) {
      const error = e as ApiError;
      console.log('POST call failed: ', JSON.parse(error.response.body));
    }
  }
  
  async function updateOptOut(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    try {
      event.preventDefault();
  
      const user = await fetchAuthSession();
      const token = user.tokens?.idToken?.toString();
      const restOperation = await patch({
        apiName: 'climapushApi',
        path: '/users/optout',
        options: {
          body: {
            city: city,
            frequency: frequency,
            optOut: optOut,
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      console.log(restOperation.response);
    } catch (e) {
      const error = e as ApiError;
      console.log('POST call failed: ', JSON.parse(error.response.body));
    }
  }

  requestPermission();

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    if (payload.data?.notification) {
      toast(<Message notification={JSON.parse(payload.data?.notification as string)} />);
    }

  });

  return (
    <>
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      alignContent="center"
      wrap="nowrap"
      gap="1rem"
    >
      <Text>Welcome, {user.username}!</Text>
      <Button onClick={signOut}>Sign Out</Button>
      <Flex
        as="form"
        direction="column"
        width="20rem"
        onSubmit={updateOptOut}
      >
        <SelectField label="City" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="1182">Campinas - SP</option>
          <option value="3656">Osasco - SP</option>
          <option value="5515">Ubatuba - SP</option>
          <option value="2245">Guarujá - SP</option>
        </SelectField>
        <SelectField label="Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="0 8-17 * * 1-5">every hour beetween 8-17 from Monday to Friday</option>
          <option value="0 12 * * ? *">every day at 12</option>
          <option value="0 * * * *">every hour</option>
          <option value="*/15 * * * *">every 15 minute</option>
        </SelectField>
        <SwitchField label="Opt Out" checked={optOut} onChange={(e) => setOptOut(e.target.checked)} />
        <Button type="submit">Save</Button>
      </Flex>
    </Flex>
    <ToastContainer />
    </>
  );
}

export default Home;
