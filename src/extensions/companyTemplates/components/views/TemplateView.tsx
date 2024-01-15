import * as React from 'react';
import { useContext } from 'react';
import { SPFxContext } from '../../contexts/SPFxContext';
import { UserService } from '../../../../services/core/UserService';

export interface ITemplateViewProps { }

export const TemplateView: React.FunctionComponent<ITemplateViewProps> = (props: React.PropsWithChildren<ITemplateViewProps>) => {
  const context = useContext(SPFxContext).context;
  const [userToken, setUserToken] = React.useState(undefined);

  React.useEffect(() => {
    const userService = context.serviceScope.consume(UserService.serviceKey);
    userService.getUserTokenDecoded()
      .then(token => { setUserToken(token) })
      .catch(er => console.log(er));
  }, []);

  return (
    <>
      <h1 key={'title'}>Template View (Standard)</h1>
      {userToken && <span>TenantId: {userToken.tid}</span>}
    </>
  );
};