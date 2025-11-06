import { FC, useEffect, useState } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
    } else {
      setName('');
    }
  }, [user]);

  return <AppHeaderUI userName={name} />;
};
