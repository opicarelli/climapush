import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  View,
} from '@aws-amplify/ui-react';
import Home from './Home';

interface AppProps {
}

const App: React.FC<AppProps> = () => {
  return (
    <View className='App'>
      <Home />
    </View>
  );
}

export default withAuthenticator(App, { hideSignUp: true });