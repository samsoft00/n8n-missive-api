import type {
  INodeType,
  INodeTypeBaseDescription,
  INodeTypeDescription,
} from 'n8n-workflow';
import { loadOptions } from './methods';

const versonDescription: INodeTypeDescription = {
  displayName: 'Missive',
  name: 'missive',
  icon: 'file:missive-icon.svg',
  iconUrl: 'https://missiveapp.com/missive-icon.svg',
  group: ['input'],
  version: 1,
  subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
  description: 'Read, update, write and delete data from Missive',
  defaults: {
    name: 'Missive'
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'missiveTokenApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['missiveTokenApi'],
        },
      },
    }
  ],
  properties: [
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'options',
      options: [
        {
          name: 'Access Token',
          value: 'missiveTokenApi',
        }
      ],
      default: 'missiveTokenApi'
    },
    // Resources
    {
      displayName: 'Resource',
      name: 'resource',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Contact',
          value: 'contact'
        },
        {
          name: 'Conversation',
          value: 'conversation'
        }
      ],
      default: 'contact',
    },
    // Operations
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new record',
          action: 'Create a record',
        },
        {
          name: 'List',
          value: 'list',
          description: 'List a record from',
          action: 'List a record',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Retrieve a record',
          action: 'Get a record',
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a record',
          action: 'Update record',
        }
      ],
      default: 'create',
      displayOptions: {
        show: {
          resource: ['contact'],
        }
      }
    },
    // ----------------------------------
    //         contact:create
    // ----------------------------------
    {
      displayName: 'Contact Book ID',
      name: 'contact_book_id',
      type: 'string',
      required: true,
      placeholder: 'Contact book ID string. ex 551b8675-11e9-49c3-aac0-01fb8510d862',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['contact'],
        }
      },
      default: ''
    },
    {
      displayName: 'Fields to Set',
      name: 'assignments',
      type: 'assignmentCollection',
      description: 'Automatically sync contacts between Missive and your CRM',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['contact'],
        }
      },
      default: {},
    },
    // {
    //   displayName: 'Options',
    //   name: 'options',
    //   type: 'collection',
    //   placeholder: 'Add Option',
    //   default: {},
    //   options: [
    //   ],
    //   displayOptions: {
    //     show: {
    //       operation: ['create'],
    //       resource: ['contact'],
    //     }
    //   }
    // },
    // ----------------------------------
    //         contact:list
    // ----------------------------------
    {
      displayName: 'Contact Book ID',
      name: 'contact_book',
      type: 'string',
      required: true,
      placeholder: 'Contact book ID string. ex 551b8675-11e9-49c3-aac0-01fb8510d862',
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
        }
      },
      default: ''
    },
    {
      displayName: 'Options',
      name: 'options',
      type: 'collection',
      default: {},
      description: 'Additional options which decide which records should be returned',
      placeholder: 'Add option',
      // options - Search Query, Order [last_name, last_modified], include_deleted, modified_source
      options: [
        {
          displayName: 'Search Query',
          name: 'search',
          type: 'string',
          default: '',
          description: 'Text string to filter contacts. search term(s) are matched against all contact infos: name, email, phone, organization, custom fields, notes, etc.'
        },
        {
          displayName: 'Order',
          name: 'order',
          type: 'options',
          default: 'last_name',
          options: [
            {
              name: 'Last Name',
              value: 'last_name'
            },
            {
              name: 'Last Modified',
              value: 'last_modified'
            },
          ],
          description: 'Default ordering is by contact last name. To get the most recently updated contacts, pass last_modified.'
        },
        {
          displayName: 'Modified Since',
          name: 'modified_since',
          type: 'number',
          default: '',
          // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
          description: 'To return only contacts that have been modified or created since a point in time, pass a Unix Epoch time like 1556137749'
        },
        {
          displayName: 'Include Deleted',
          name: 'include_deleted',
          type: 'boolean',
          default: false,
          // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
          description: 'To include deleted contacts in the results of modified_since requests, pass true'
        }
      ],
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
        }
      }
    },
    {
      displayName: 'Limit',
      name: 'limit',
      type: 'number',
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
          // returnAll: [false],
        },
      },
      typeOptions: {
        minValue: 1,
      },
      default: 50,
      description: 'Max number of results to return',
    },
    {
      displayName: 'Offset',
      name: 'offset',
      type: 'number',
      default: 0,
      description: 'Offset used to paginate',
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
        }
      }
    },
    // ----------------------------------
    //         contact:Get a contact
    // ----------------------------------
    {
      displayName: 'Contact ID',
      name: 'contact_id',
      type: 'string',
      required: true,
      placeholder: 'Contact book ID string. ex 551b8675-11e9-49c3-aac0-01fb8510d862',
      displayOptions: {
        show: {
          operation: ['get'],
          resource: ['contact'],
        }
      },
      default: ''
    },
    {
      displayName: 'Fetch a specific contact using the contact ID. Trying to get a deleted contact will produce a 404 response.',
      name: 'notice',
      type: 'notice',
      default: '',
      displayOptions: {
        show: {
          operation: ['get'],
          resource: ['contact'],
        }
      }
    },
    // ----------------------------------
    //      contact:Update a contact
    // ----------------------------------
    {
      displayName: 'Columns',
      name: 'columns',
      type: 'resourceMapper',
      noDataExpression: true,
      default: {
        mappingMode: 'defineBelow',
        value: null
      },
      required: true,
      typeOptions: {
        resourceMapper: {
          resourceMapperMethod: 'getColumnsWithContactId',
          mode: 'update',
          fieldWords: {
            singular: 'column',
            plural: 'columns'
          },
          addAllFields: true,
          multiKeyMatch: true
        }
      },
      displayOptions: {
        show: {
          resource: ['contact'],
          operation: ['update'],
        }
      }
    }
  ]
}

export class Missive implements INodeType {
  description: INodeTypeDescription;

  constructor(baseDescription: INodeTypeBaseDescription) {
    this.description = {
      ...baseDescription,
      ...versonDescription,
    }
  }

  methods = {
    loadOptions,
    // credentialTest,
  }

  // methods?: { 
  //   loadOptions?: { [key: string]: (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>; }; 
  //   listSearch?: { [key: string]: (this: ILoadOptionsFunctions, filter?: string, paginationToken?: string) => Promise<INodeListSearchResult>; }; 
  //   credentialTest?: { [functionName: string]: ICredentialTestFunction; }; 
  //   resourceMapping?: { [functionName: string]: (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>; }; 
  // } | undefined;

  /*
    execute?(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      const authentication = this.getNodeParameter('authentication', 0)
  
      const items = this.getInputData();
      const returnData: INodeExecutionData[] = [];
      let responseData;
    }
  
    poll?(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
        throw new Error('Method not implemented.');
    }
    trigger?(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
        throw new Error('Method not implemented.');
    }
    webhook?(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        throw new Error('Method not implemented.');
    }
    methods?: { loadOptions?: { [key: string]: (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>; }; listSearch?: { [key: string]: (this: ILoadOptionsFunctions, filter?: string, paginationToken?: string) => Promise<INodeListSearchResult>; }; credentialTest?: { [functionName: string]: ICredentialTestFunction; }; resourceMapping?: { [functionName: string]: (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>; }; } | undefined;
    webhookMethods?: { default?: { checkExists: (this: IHookFunctions) => Promise<boolean>; create: (this: IHookFunctions) => Promise<boolean>; delete: (this: IHookFunctions) => Promise<boolean>; } | undefined; setup?: { checkExists: (this: IHookFunctions) => Promise<boolean>; create: (this: IHookFunctions) => Promise<boolean>; delete: (this: IHookFunctions) => Promise<boolean>; } | undefined; } | undefined;
   */
}
