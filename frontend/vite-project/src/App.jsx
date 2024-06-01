import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [isAthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // const data = {
    //   username: 'gorath71',
    //   password: 'password'
    // }
    fetch('/api/authorizeUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))

  }, []);

  return (
    <div>App</div>
  )
}

export default App