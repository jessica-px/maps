import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Directory, UserState } from '../UserContext';

// --------------------------------------------------------------- //
//                          Sub-Components                         //
// --------------------------------------------------------------- //

interface DirectoryContainerProps {
  dir: Directory
}

const DirectoryContainer = ({ dir }: DirectoryContainerProps) => (
  <>
    <h3>{dir.name}</h3>
    <ul>
      {dir.maps.map((map) => <li key={map.id}><Link to={`/maps?id=${map.id}`}>{map.name}</Link></li>)}
    </ul>
  </>
);

// --------------------------------------------------------------- //
//                          Main Component                         //
// --------------------------------------------------------------- //

export const HomePage = () => {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [directories, setDirectories] = useState<Directory[] | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const getUser = () => {
    fetch('/api/user', getOptions)
      .then((response: any) => response.json()) // eslint-disable-line @typescript-eslint/no-explicit-any
      .then((json: UserState) => {
        setUserState(json);
        getDirectories(json.id);
      });
  };

  const getDirectories = (id: string) => {
    fetch(`/api/directories?userId=${id}`, getOptions)
      .then((response: any) => response.json()) // eslint-disable-line @typescript-eslint/no-explicit-any
      .then((json: Directory[]) => {
        setDirectories(json);
      });
  };

  if (userState && directories) {
    return (
      <>
        <h1>Home Page</h1>
        <p>Hello, {userState.name}</p>
        {
          directories.map((dir) => <DirectoryContainer dir={dir} key={dir.id} />)
        }
      </>
    );
  }

  return <p>Loading...</p>;
};
