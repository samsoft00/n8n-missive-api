import type {
  IAuthenticate,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties
} from 'n8n-workflow';

export class MissiveTokenApi implements ICredentialType {
  name = 'missiveTokenApi';

  displayName = 'Missive Personal Access Token API';

  properties: INodeProperties[] = [
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
    {
      displayName: `To start using the API, you first need to get your API token. <br>
        Get it from your Missive preferences, click the API tab, then the Create a new token link.`,
      name: 'notice',
      type: 'notice',
      default: '',
    },
  ];

  documentationUrl: string = 'https://missiveapp.com/help/api-documentation/getting-started';

  authenticate?: IAuthenticate = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.accessToken}}',
      }
    }
  };

  test?: ICredentialTestRequest = {
    request: {
      baseURL: ''
    }
  }
}