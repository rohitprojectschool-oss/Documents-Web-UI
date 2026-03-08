import { useMachine } from '@xstate/react';
import createUsersMachine from './machine';
import { locale } from '../../locale/locale';
import './Users.scss';

function Users() {
  const [_state] = useMachine(createUsersMachine());

  return (
    <div className="users">
      <div className="users__header">
        <h1 className="users__title">{locale('pages.users')}</h1>
      </div>
      <div className="users__placeholder">
        <p>Users content coming soon.</p>
      </div>
    </div>
  );
}

export default Users;
