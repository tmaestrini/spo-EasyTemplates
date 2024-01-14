import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { AadTokenProviderFactory } from "@microsoft/sp-http";

export interface IUserService {
  getUserToken(resourceEndpoint?: string): Promise<string>;
  getUserTokenDecoded(resourceEndpoint?: string): Promise<string>;
}

export class UserService implements IUserService {

  private aadTokenProviderFactory: AadTokenProviderFactory;

  public static readonly serviceKey: ServiceKey<IUserService> =
    ServiceKey.create<IUserService>('CompanyTemplates:UserService', UserService);

  constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      this.aadTokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);
    })
  }

  public async getUserToken(resourceEndpoint: string = 'https://graph.microsoft.com'): Promise<string> {
    return await this.aadTokenProviderFactory.getTokenProvider().then(async (tokenProvider) => {
      const token = await tokenProvider.getToken(resourceEndpoint);
      return token;
    })
  }

  public async getUserTokenDecoded(resourceEndpoint: string = 'https://graph.microsoft.com'): Promise<string> {
    const token = await this.getUserToken(resourceEndpoint);
    return this.decodeUserToken(token);
  }

  private decodeUserToken(token: string): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

}