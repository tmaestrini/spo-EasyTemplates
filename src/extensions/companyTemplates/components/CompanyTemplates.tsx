import * as React from "react";
import { DialogContent } from "@fluentui/react";
import { useContext, useEffect, useState } from "react";
import { UserService } from "../../../services/core/UserService";
import { SPFxContext } from "../contexts/SPFxContext";
import { SecurityManager } from "./SecurityManager";

type ICompanyTemplatesProps = {

}

export const CompanyTemplates: React.FunctionComponent<ICompanyTemplatesProps> = (props: React.PropsWithChildren<ICompanyTemplatesProps>) => {
  const context = useContext(SPFxContext).context;
  const [userToken, setUserToken] = useState(undefined);

  useEffect(() => {
    const userService = context.serviceScope.consume(UserService.serviceKey);
    userService.getUserTokenDecoded()
      .then(token => { setUserToken(token) })
      .catch(er => console.log(er));
  }, []);

  return <>
    <DialogContent styles={{ content: { maxHeight: "80vh", height: "80vh", width: "80vw", overflowY: "scroll" } }} title={'Company Templates'}>
      <SecurityManager>
        <h1 key={'title'}>Welcome!</h1>
        {userToken && <span>TenantId: {userToken.tid}</span>}
      </SecurityManager>
    </DialogContent>
  </>
}
