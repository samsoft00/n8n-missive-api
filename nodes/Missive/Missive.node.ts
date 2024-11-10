import {
  ILoadOptionsFunctions,
  INodePropertyOptions,
  JsonObject,
  NodeApiError,
  NodeConnectionType,
  type INodeType,
  type INodeTypeBaseDescription,
  type INodeTypeDescription,
} from 'n8n-workflow';
import { missiveApiRequest } from './transport';
import { sortOptions } from './GenericFunctions'

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
  // eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
  inputs: [NodeConnectionType.Main],
  // eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
  outputs: [NodeConnectionType.Main],

  credentials: [
    {
      name: 'missiveTokenApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['missiveTokenApi'],
        }
      },
      testedBy: {
        request: {
          method: 'GET',
          url: '/users'
        }
      }
    }
  ],

  requestDefaults: {
    baseURL: 'https://public.missiveapp.com/v1',
    url: ''
  },

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
        },
        {
          name: 'Draft',
          value: 'draft'
        },
        {
          name: 'Message',
          value: 'message'
        },
        {
          name: 'Post',
          value: 'post'
        },
        {
          name: 'Shared Label',
          value: 'sharedLabel'
        }
      ],
      default: 'contact',
    },

    // ----------------------------------
    //         contact
    // ----------------------------------
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new contact',
          action: 'Create a contact',
        },
        {
          name: 'List',
          value: 'list',
          description: 'List a contact from Missive',
          action: 'List a contact',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Retrieve a contact',
          action: 'Get a contact',
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a contact',
          action: 'Update contact',
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
    //         contact:update
    // ----------------------------------
    {
      displayName: 'Contact Book Name or ID',
      name: 'contactBook',
      type: 'options',
      typeOptions: {
        loadOptionsMethod: 'getContactBook',
      },
      options: [],
      default: '',
      required: true,
      displayOptions: {
        show: {
          operation: ['update'],
          resource: ['contact'],
        },
      },
      description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>'
    },
    {
      displayName: 'Contact Name or ID',
      name: 'contact',
      type: 'options',
      typeOptions: {
        loadOptionsMethod: 'getContacts',
        loadOptionsDependsOn: ['contactBook']
      },
      options: [],
      default: '',
      required: true,
      displayOptions: {
        show: {
          operation: ['update'],
          resource: ['contact'],
        },
      },
      description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    },
    // ----------------------------------
    //         contact:create
    // ----------------------------------
    {
      displayName: 'Contact Book Name or ID',
      name: 'contactBookId',
      type: 'options',
      default: '',
      options: [],
      required: true,
      typeOptions: {
        loadOptionsMethod: 'getContactBook'
      },
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['contact'],
        },
      },
      description: 'The contact book to create contact on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
      displayName: 'Additional Fields',
      name: 'otherProperties',
      type: 'collection',
      displayOptions: {
        show: {
          resource: ['contact'],
          operation: ['create', 'update'],
        },
      },
      default: {},
      placeholder: 'Add Field',

      options: [
        {
          displayName: 'File As',
          name: 'file_as',
          type: 'string',
          default: '',
          description: 'The contact file As'
        },
        {
          displayName: 'First Name',
          name: 'first_name',
          type: 'string',
          default: '',
          description: 'The contact first name'
        },
        {
          displayName: 'Gender',
          name: 'gender',
          type: 'options',
          options: [
            {
              name: 'Male',
              value: 'male'
            },
            {
              name: 'Female',
              value: 'female'
            }
          ],
          default: 'male'
        },
        {
          displayName: 'Last Name',
          name: 'last_name',
          type: 'string',
          default: '',
          description: 'The contact last name'
        },
        {
          displayName: 'Middle Name',
          name: 'middle_name',
          type: 'string',
          default: '',
          description: 'The contact middle name'
        },
        {
          displayName: 'Nickname',
          name: 'nickname',
          type: 'string',
          default: '',
          description: 'The contact nickname'
        },
        {
          displayName: 'Notes',
          name: 'notes',
          type: 'string',
          typeOptions: {
            rows: 2
          },
          default: '',
          description: 'The contact notes'
        },
        {
          displayName: 'Phonetic First Name',
          name: 'phonetic_first_name',
          type: 'string',
          default: '',
          description: 'The contact phonetic first name'
        },
        {
          displayName: 'Phonetic Last Name',
          name: 'phonetic_last_name',
          type: 'string',
          default: '',
          description: 'The contact phonetic last name'
        },
        {
          displayName: 'Phonetic Middle Name',
          name: 'phonetic_middle_name',
          type: 'string',
          default: '',
          description: 'The contact phonetic middle name'
        },
        {
          displayName: 'Prefix',
          name: 'prefix',
          type: 'string',
          default: '',
          description: 'The contact prefix'
        },
        {
          displayName: 'Starred',
          name: 'starred',
          type: 'boolean',
          default: true,
          description: 'Whether to to starred contact'
        },
        {
          displayName: 'Suffix',
          name: 'suffix',
          type: 'string',
          default: '',
          description: 'The contact suffix'
        }
      ]
    },
    // ----------------------------------
    //         contact:list
    // ----------------------------------
    {
      displayName: 'Contact Book Name or ID',
      name: 'contactBook',
      type: 'options',
      default: '',
      required: true,
      options: [],
      typeOptions: {
        loadOptionsMethod: 'getContactBook'
      },
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
        },
      },
      description: 'The contact book to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    // -> order, modified_since, included_deleted, search
    {
      displayName: 'Additional Fields',
      name: 'otherProperties',
      type: 'collection',
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
        },
      },
      default: {},
      options: [
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
          description: 'To return only contacts that have been modified or created since a point in time, pass a Unix Epoch time like 1556137749'
        },
        {
          displayName: 'Include Deleted',
          name: 'include_deleted',
          type: 'boolean',
          default: false,
          // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
          description: 'To include deleted contacts in the results of modified_since requests, pass true'
        },
        {
          displayName: 'Search',
          name: 'search',
          type: 'string',
          default: '',
          typeOptions: {
            rows: 2
          },
          // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
          description: 'To include deleted contacts in the results of modified_since requests, pass true'
        }
      ],
      placeholder: 'Add Field',
    },
    {
      displayName: 'Return All',
      name: 'returnAll',
      type: 'boolean',
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
        },
      },
      default: false,
      description: 'Whether to return all results or only up to a given limit',
    },
    {
      displayName: 'Limit',
      name: 'limit',
      type: 'number',
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['contact'],
          returnAll: [false],
        },
      },
      typeOptions: {
        minValue: 1,
      },
      default: 50,
      description: 'Max number of results to return',
    },

    // ----------------------------------
    //         contact:get
    // ----------------------------------
    {
      displayName: 'Contact ID',
      name: 'id',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: {
          operation: ['get'],
          resource: ['contact'],
        },
      },
      description: 'The ID of the contact to get the data of',
    },

    // ----------------------------------
    //         conversation
    // ----------------------------------
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'List',
          value: 'list',
          description: 'List a conversation from Missive',
          action: 'List a conversation',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Retrieve a conversation',
          action: 'Get a conversation',
        },
        {
          name: 'List Conversation Messages',
          value: 'listMessage',
          description: 'List messages from conversation',
          action: 'List conversation',
        }
      ],
      default: 'list',
      displayOptions: {
        show: {
          resource: ['conversation'],
        }
      }
    },

    // ----------------------------------
    //         conversation:list
    // ----------------------------------
    {
      displayName: 'Params Fields',
      name: 'otherProperties',
      type: 'collection',
      displayOptions: {
        show: {
          operation: ['list'],
          resource: ['conversation'],
        },
      },
      default: {},
      options: [
        {
          displayName: "All",
          name: "all",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in the All mailbox"
        },
        {
          displayName: "Assigned",
          name: "assigned",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in Assigned to me"
        },
        {
          displayName: "Closed",
          name: "closed",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in Closed"
        },
        {
          displayName: "Flagged",
          name: "flagged",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in Starred"
        },
        {
          displayName: "Inbox",
          name: "inbox",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in the Inbox"
        },
        {
          displayName: "Junked",
          name: "junked",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in Spam"
        },
        {
          displayName: "Organization",
          name: "organization",
          type: "string",
          default: "",
          description: "Organization ID. Filter conversations to only those shared with the organization."
        },
        {
          displayName: "Shared Label",
          name: "shared_label",
          type: "string",
          default: "",
          description: "Shared label ID. List conversations in the shared label."
        },
        {
          displayName: "Snoozed",
          name: "snoozed",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in Snoozed"
        },
        {
          displayName: "Team All",
          name: "team_all",
          type: "string",
          default: "",
          description: "Team ID. List conversations in the team's All mailbox."
        },
        {
          displayName: "Team Closed",
          name: "team_closed",
          type: "string",
          default: "",
          description: "Team ID. List conversations in the team's Closed mailbox."
        },
        {
          displayName: "Team Inbox",
          name: "team_inbox",
          type: "string",
          default: "",
          description: "Team ID. List conversations in the team's Inbox."
        },
        {
          displayName: "Trashed",
          name: "trashed",
          type: "boolean",
          default: false,
          description: "Whether to pass true to list conversations in Trash"
        },
        {
          displayName: "Until",
          name: "until",
          type: "number",
          default: "",
          description: "Timestamp value in Unix time used to paginate. Use the last_activity_at of the oldest conversation from previous page."
        }
      ],
      placeholder: 'Add Field',
    },
    // ----------------------------------
    //         conversation:get
    // ----------------------------------
    {
      displayName: 'Conversations ID',
      name: 'id',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: {
          operation: ['get', 'listMessage'],
          resource: ['conversation'],
        },
      },
      description: 'The ID of the contact to get the data of',
    },
    {
      displayName: 'Note that the returned conversation may have a different ID. This happens when conversations get merged; passing an old conversation ID will keep working, but the new conversation ID will be returned.',
      name: 'notice',
      type: 'notice',
      default: '',
      displayOptions: {
        show: {
          operation: ['get'],
          resource: ['conversation'],
        },
      },
    },
    // ----------------------------------
    //         conversation:messages
    // ----------------------------------
    {
      displayName: 'Returns messages ordered from newest to oldest. To paginate, pass an until param equal to the delivered_at of the oldest message returned in the previous page. The last page is reached when fewer messages than limit are returned or if all messages in a page have the same delivered_at.',
      name: 'notice',
      type: 'notice',
      default: '',
      displayOptions: {
        show: {
          operation: ['listMessage'],
          resource: ['conversation'],
        },
      },
    },
    {
      displayName: 'Params Fields',
      name: 'otherProperties',
      type: 'collection',
      displayOptions: {
        show: {
          operation: ['listMessage'],
          resource: ['conversation'],
        },
      },
      default: {},
      options: [
        {
          displayName: "Until",
          name: "until",
          type: "number",
          default: "",
          description: "Timestamp value in Unix time used to paginate. Use the last_activity_at of the oldest conversation from previous page."
        }
      ],
      placeholder: 'Add Field',
    },
    // ----------------------------------
    //         message
    // ----------------------------------
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a message on Missive',
          action: 'Create a message',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Retrieve a message',
          action: 'Get a message',
        },
        {
          name: 'List Messages',
          value: 'listMessage',
          description: 'List messages from Missive',
          action: 'List messages',
        }
      ],
      default: 'create',
      displayOptions: {
        show: {
          resource: ['message'],
        }
      }
    },
    // ----------------------------------
    //         message:create
    // ----------------------------------    
    {
      displayName: 'Account ID',
      name: 'accountId',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['message'],
        },
      },
      description: 'Account ID. You can find this ID in the custom channel settings.',
    },
    {
      displayName: 'Email Channel Only',
      name: 'emailChannelOnly',
      type: 'boolean',
      default: true,
      description: 'Whether to use email channel only',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['message'],
        }
      }
    },
    {
      displayName: 'Params Fields',
      name: 'otherProperties',
      type: 'collection',
      placeholder: 'Add Field',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['message'],
          emailChannelOnly: [true]
        },
      },
      default: {},
      options: [
        {
          displayName: 'Add Assignees',
          name: 'addAssignees',
          type: 'string',
          description: 'Array of user ID strings',
          placeholder: 'Add Users',
          default: '',
        },
        {
          displayName: 'Add Shared Labels',
          name: 'addSharedLabels',
          type: 'string',
          description: 'Array of shared label ID strings',
          default: '',
        },
        {
          displayName: 'Add To Inbox',
          name: 'addToInbox',
          type: 'boolean',
          // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
          description: 'Weather to default based on channel sharing settings: Inbox or Team Inbox',
          default: false,
        },
        {
          displayName: 'Add To Team Inbox',
          name: 'addToTeamInbox',
          type: 'boolean',
          // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
          description: 'Weather to Default based on channel sharing settings: Inbox or Team Inbox',
          default: false,
        },
        {
          displayName: 'Add Users',
          name: 'addUsers',
          type: 'string',
          description: 'Array of user ID strings',
          placeholder: 'Add Users',
          default: '',
        },
        {
          displayName: 'Attachments',
          name: 'attachments',
          type: 'string',
          placeholder: 'Add Files',
          description: 'Array containing files, see below for details',
          default: '',
          typeOptions: { multipleValues: true },
          options: []
        },
        {
          displayName: 'BCC Fields',
          name: 'bccFields',
          type: 'fixedCollection',
          placeholder: 'Add BCC Fields',
          description: 'Array of objects with "address" and "name" keys',
          default: {},
          typeOptions: { multipleValues: true },
          options: [
            {
              name: 'fromFieldValues',
              displayName: 'BCC Fields',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: '',
                  placeholder: 'Name of the user'
                },
                {
                  displayName: 'Address',
                  name: 'address',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com',
                }
              ]
            }
          ]
        },
        {
          displayName: 'CC Fields',
          name: 'ccFields',
          type: 'fixedCollection',
          placeholder: 'Add CC Fields',
          description: 'Array of objects with "address" and "name" keys',
          default: {},
          typeOptions: { multipleValues: true },
          options: [
            {
              name: 'fromFieldValues',
              displayName: 'CC Fields',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: '',
                  placeholder: 'Name of the user'
                },
                {
                  displayName: 'Address',
                  name: 'address',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com',
                }
              ]
            }
          ]
        },
        {
          displayName: 'Close',
          name: 'close',
          type: 'boolean',
          // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
          description: 'Weather to Default based on channel sharing settings: Inbox or Team Inbox',
          default: false,
        },
        {
          displayName: 'Conversation Color',
          name: 'conversationColor',
          type: 'color',
          description: 'HEX color code or "good" "warning" "danger" string',
          placeholder: 'Select Coversation Color',
          default: '',
        },
        {
          displayName: 'Conversation Name or ID',
          name: 'conversation',
          type: 'options',
          typeOptions: {
            loadOptionsMethod: 'getConversations'
          },
          default: '',
          description: 'Conversation ID string for appending to an existing conversation. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        },
        {
          displayName: 'Conversation Subject',
          name: 'conversationSubject',
          type: 'string',
          description: 'Array of user ID strings',
          placeholder: 'Add Users',
          default: '',
        },
        {
          displayName: 'Delivered At',
          name: 'deliveredAt',
          type: 'dateTime',
          placeholder: 'Add Message delivery timestamp',
          description: 'Message delivery timestamp. If omitted, message is marked as delivered at request time.',
          default: '',
        },
        {
          displayName: 'External ID',
          name: 'externalId',
          type: 'string',
          placeholder: 'Add External ID',
          default: '',
          description: 'Unique ID used to identify non-email messages (SMS, Instagram DMs, etc)'
        },
        {
          displayName: 'Force Team',
          name: 'team',
          type: 'boolean',
          default: false
        },
        {
          displayName: 'From Field',
          name: 'fromField',
          type: 'fixedCollection',
          placeholder: 'Add From Field',
          default: {},
          typeOptions: {
            multipleValues: false
          },
          description: 'Object with "address" and "name" keys',
          options: [
            {
              name: 'fromFieldValues',
              displayName: 'From Field',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: '',
                  placeholder: 'Name of the user'
                },
                {
                  displayName: 'Address',
                  name: 'address',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com',
                }
              ]
            }
          ]
        },
        {
          displayName: 'Organization Name or ID',
          name: 'organization',
          type: 'options',
          typeOptions: {
            loadOptionsMethod: 'getOrganization'
          },
          default: '',
          description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        },
        {
          displayName: 'References',
          name: 'references',
          type: 'string',
          default: '',
          description: 'Array of strings for appending to an existing conversation'
        },
        {
          displayName: 'Remove Shared Labels',
          name: 'removeSharedLabels',
          type: 'string',
          description: 'Array of shared label ID strings',
          default: '',
        },
        {
          displayName: 'Team ID',
          name: 'team',
          type: 'string',
          default: '',
          description: 'Default based on channel sharing settings: Inbox or Team Inbox'
        },
        {
          displayName: 'To Fields',
          name: 'toFields',
          type: 'fixedCollection',
          placeholder: 'Add To Field',
          default: {},
          typeOptions: {
            multipleValues: true
          },
          description: 'Array of objects with "address" and "name" keys',
          options: [
            {
              name: 'fromFieldValues',
              displayName: 'To Field',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: '',
                  placeholder: 'Name of the user'
                },
                {
                  displayName: 'Address',
                  name: 'address',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com',
                }
              ]
            }
          ]
        }
      ]
    },
    // ----------------------------------
    //         message:get
    // ----------------------------------
    {
      displayName: 'Message ID',
      name: 'id',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: {
          operation: ['get', 'listMessage'],
          resource: ['message'],
        },
      },
      description: 'The ID of the message to get the data of',
    },
    // ----------------------------------
    //         message:list
    // ----------------------------------

    // ----------------------------------
    //         draft
    // ----------------------------------
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Create a Draft',
          value: 'create',
          description: 'Create a draft/send a message in Missive',
          action: 'Create a draft',
        }
      ],
      default: 'create',
      displayOptions: {
        show: {
          resource: ['draft'],
        }
      }
    },
    // ----------------------------------
    //         draft:create
    // ----------------------------------
    {
      displayName: 'Subject',
      name: 'subject',
      type: 'string',
      placeholder: 'Subject',
      default: '',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['draft'],
        }
      }
    },
    {
      displayName: 'Body',
      name: 'body',
      type: 'string',
      placeholder: 'Body',
      default: '',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['draft'],
        }
      }
    },
    {
      displayName: 'From Field Type',
      name: 'fromFieldOptn',
      type: 'options',
      placeholder: 'Select the from Field Type',
      options: [
        { name: 'Email', value: 'email' },
        { name: 'SMS & WhatsApp', value: 'sms' },
        { name: 'Phone Number', value: 'phone_number' },
        { name: 'Custom Channel', value: 'custom' }
      ],
      default: 'email',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['draft'],
        }
      }
    },
    {
      displayName: 'To Field Type',
      name: 'toFieldOptn',
      type: 'options',
      placeholder: 'Select the to Field Type',
      options: [
        { name: 'Custom Channel', value: 'custom' },
        { name: 'Email', value: 'email' },
        { name: 'Messenger & Instagram', value: 'instagram' },
        { name: 'Missive Live Chat', value: 'livechat' },
        { name: 'SMS & WhatsApp', value: 'sms' }
      ],
      default: 'email',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['draft'],
        }
      }
    },
    {
      displayName: 'Params Fields',
      name: 'otherProperties',
      type: 'collection',
      placeholder: 'Add Field',
      displayOptions: {
        show: {
          operation: ['create'],
          resource: ['draft'],
        },
      },
      default: {},
      options: [
        {
          displayName: 'Account',
          name: 'account',
          type: 'string',
          placeholder: 'Account ID',
          default: '',
          description: 'Account ID. You can find this ID in the custom channel, Missive Live Chat settings or Settings > API > Resource IDs.'
        },
        {
          displayName: 'Attachments',
          name: 'attachments',
          type: 'fixedCollection',
          placeholder: 'Array of files',
          default: [],
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'Add File',
              values: [
                {
                  displayName: 'Base64 Data',
                  name: 'base64_data',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Filename',
                  name: 'filename',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com'
                }
              ]
            }
          ],
          description: 'Array containing files, see below for details'
        },
        {
          displayName: 'BCC Fields',
          name: 'bccFields',
          type: 'fixedCollection',
          placeholder: 'Add Bcc Fields',
          default: [],
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'Add BCC Fields',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Email',
                  name: 'email',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com'
                }
              ]
            }
          ],
          description: 'Array of objects with "address" and "name" keys'
        },
        {
          displayName: 'CC Field',
          name: 'ccField',
          type: 'fixedCollection',
          placeholder: 'Add CC Field',
          default: [],
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'Add CC Field',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Email',
                  name: 'email',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com'
                }
              ]
            }
          ],
          // displayOptions: { show: { '/toFieldOptn': ['livechat'] } },
          description: 'Array of objects with "address" and "name" keys'
        },
        {
          displayName: 'Conversation Name or ID',
          name: 'conversation',
          type: 'string',
          placeholder: 'Conversation ID',
          default: '',
          description: 'Conversation ID string for appending to an existing conversation'
        },
        {
          displayName: 'Force Team',
          name: 'force_team',
          type: 'boolean',
          placeholder: 'Weather to force team',
          default: false
        },        
        {
          displayName: 'From Field',
          name: 'fromFieldEmail',
          type: 'fixedCollection',
          placeholder: 'Add From Field',
          default: {},
          typeOptions: {
            multipleValues: false,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'From Field',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: '',
                  placeholder: 'Name of the user'
                },
                {
                  displayName: 'Address',
                  name: 'address',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com',
                }
              ]
            }
          ],
          displayOptions: { show: { '/fromFieldOptn': ['email'] } },
          // description: 'Object with "address" and "name" keys',
        },
        {
          displayName: 'From Field',
          name: 'fromFieldPhone',
          type: 'fixedCollection',
          placeholder: 'Add From Field',
          default: {},
          typeOptions: {
            multipleValues: false,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'Add From Field',
              values: [
                {
                  displayName: 'Phone Number',
                  name: 'phoneNumber',
                  type: 'string',
                  default: '',
                  placeholder: 'Phone number of the user'
                },
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: '',
                  placeholder: 'Name of the user',
                }
              ]
            }
          ],
          displayOptions: { show: { '/fromFieldOptn': ['phone_number'] } },
          description: 'Object with the "phone_number", "address" or "name" keys, used to match contacts in the Missive sidebar and populate the authors line in the conversation preview',
        },
        {
          displayName: 'From Field',
          name: 'fromFieldSMS',
          type: 'fixedCollection',
          placeholder: 'Add From Field',
          default: {},
          typeOptions: {
            multipleValues: false,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'From Field',
              values: [
                {
                  displayName: 'Phone Number',
                  name: 'phoneNumber',
                  type: 'string',
                  required: true,
                  default: '',
                  placeholder: 'Name of the user'
                },
                {
                  displayName: 'Type',
                  name: 'type',
                  type: 'options',
                  options: [
                    { name: 'Twilio Whatsapp', value: 'twilio_whatsapp' },
                    { name: 'Twilio', value: 'twilio' },
                    { name: 'Signalwire', value: 'signalwire' }
                  ],
                  default: 'twilio_whatsapp'
                }
              ]
            }
          ],
          displayOptions: { show: { '/fromFieldOptn': ['sms'] } },
          description: 'Object with "phone_number" key, it must match an account number you have access to, formatted as "+" followed by digits only. An optional "type" key with values of "signalwire", "twilio" or "twilio_whatsapp" needs to be provided when the phone number matches accounts of different types.'
        },
        {
          displayName: 'From Field',
          name: 'fromFieldCustom',
          type: 'fixedCollection',
          placeholder: 'Add From Field',
          default: [],
          typeOptions: {
            multipleValues: false,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'Add Custom From Field',
              values: [
                {
                  displayName: 'ID',
                  name: 'id',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Username',
                  name: 'username',
                  type: 'string',
                  default: ''
                }
              ]
            }
          ],
          displayOptions: { show: { '/fromFieldOptn': ['custom'] } },
          description: 'Object with "ID", "Username" and "Name" keys'
        },
        {
          displayName: 'Team ID',
          name: 'team',
          type: 'string',
          placeholder: 'Team ID',
          default: '',
          description: 'Team ID string'
        },
        {
          displayName: 'To Field',
          name: 'toFieldEmail',
          type: 'fixedCollection',
          placeholder: 'Add To Field',
          default: {},
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'To Field',
              values: [
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: '',
                  placeholder: 'Name of the user'
                },
                {
                  displayName: 'Address',
                  name: 'address',
                  type: 'string',
                  default: '',
                  placeholder: 'name@email.com',
                }
              ]
            }
          ],
          displayOptions: { show: { '/toFieldOptn': ['email'] } }
        },
        {
          displayName: 'To Field',
          name: 'toFieldPhone',
          type: 'fixedCollection',
          placeholder: 'Add To Field',
          default: [],
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'To Field',
              values: [
                {
                  displayName: 'Phone Number',
                  name: 'phoneNumber',
                  type: 'string',
                  default: '',
                  placeholder: 'Phone number of the user'
                }
              ]
            }
          ],
          displayOptions: { show: { '/toFieldOptn': ['sms'] } },
          description: 'Object with "phone_number" key, only one item is allowed and it must be formatted as "+" followed by digits only'
        },
        {
          displayName: 'To Field',
          name: 'toFieldInstagram',
          type: 'fixedCollection',
          placeholder: 'Add To Field',
          default: [],
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'To Field',
              values: [
                {
                  displayName: 'Messenger & Instagram',
                  name: 'id',
                  type: 'string',
                  default: '',
                  placeholder: 'Messenger and Instagram ID.'
                }
              ]
            }
          ],
          displayOptions: { show: { '/toFieldOptn': ['instagram'] } },
          description: 'Object with the "ID" key'
        },
        {
          displayName: 'To Field',
          name: 'toFieldCustom',
          type: 'fixedCollection',
          placeholder: 'Add From Field',
          default: [],
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'Add Custom From Field',
              values: [
                {
                  displayName: 'ID',
                  name: 'id',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Username',
                  name: 'username',
                  type: 'string',
                  default: ''
                }
              ]
            }
          ],
          displayOptions: { show: { '/toFieldOptn': ['custom'] } },
          description: 'Object with "ID", "Username" and "Name" keys'
        },
        {
          displayName: 'To Field',
          name: 'toFieldLive',
          type: 'fixedCollection',
          placeholder: 'Add From Field',
          default: [],
          typeOptions: {
            multipleValues: true,
          },
          options: [
            {
              name: 'metadataValues',
              displayName: 'Add Live Chat Field',
              values: [
                {
                  displayName: 'ID',
                  name: 'id',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Name',
                  name: 'name',
                  type: 'string',
                  default: ''
                },
                {
                  displayName: 'Username',
                  name: 'username',
                  type: 'string',
                  default: ''
                }
              ]
            }
          ],
          displayOptions: { show: { '/toFieldOptn': ['livechat'] } },
          description: 'Object with "ID", "Username" and "Name" keys'
        }
      ]
    }
  ]
};

export class Missive implements INodeType {
  description: INodeTypeDescription;

  constructor(baseDescription: INodeTypeBaseDescription) {
    this.description = {
      ...baseDescription,
      ...versonDescription
    }
  }

  methods = {
    loadOptions: {
      async getContacts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const contactBookId = this.getNodeParameter('contactBook') as string;

        const responseData = await missiveApiRequest.call(
          this,
          'GET',
          `/contacts?contact_book=${contactBookId}`,
          {}
        );

        if (responseData.contacts.length === 0) {
          throw new NodeApiError(this.getNode(), responseData as JsonObject, {
            message: 'No data got returned'
          })
        }

        const returnData: INodePropertyOptions[] = [];
        for (const contactData of responseData.contacts) {

          returnData.push({
            name: `${contactData.last_name} ${contactData.first_name}`,
            value: contactData.id
          })
        }

        sortOptions(returnData)

        return returnData;
      },

      async getContactBook(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const responseData = await missiveApiRequest.call(this, 'GET', '/contact_books', {});

        if (responseData.contact_books.length === 0) {
          throw new NodeApiError(this.getNode(), responseData as JsonObject, {
            message: 'No data got returned'
          })
        }

        const returnData: INodePropertyOptions[] = [];
        for (const contactData of responseData.contact_books) {

          returnData.push({
            name: contactData.name,
            value: contactData.id
          })
        }

        sortOptions(returnData)
        return returnData;
      },

      async getConversations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const orgData = await missiveApiRequest.call(this, 'GET', '/organizations', {});

        if (orgData.organizations.length === 0) {
          throw new NodeApiError(this.getNode(), orgData as JsonObject, {
            message: 'No data got returned'
          })
        }

        const returnData: INodePropertyOptions[] = [];
        for (const organisation of orgData.organizations) {

          returnData.push({
            name: organisation.name,
            value: organisation.id
          })
        }

        sortOptions(returnData)
        return returnData;
      },

      async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        // const organizationId = this.getNodeParameter('organisationId') as string;

        const usersData = await missiveApiRequest.call(this, 'GET', '/users', {});

        if (usersData.users.length === 0) {
          throw new NodeApiError(this.getNode(), usersData as JsonObject, {
            message: 'No data got returned'
          })
        }

        const returnData: INodePropertyOptions[] = [];
        for (const user of usersData.users) {

          returnData.push({
            name: user.name,
            value: user.id
          })
        }

        sortOptions(returnData)
        return returnData;
      },

      async listTeam(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        // const organizationId = this.getNodeParameter('organisationId') as string;

        const teamData = await missiveApiRequest.call(this, 'GET', '/teams', {});

        if (teamData.users.length === 0) {
          throw new NodeApiError(this.getNode(), teamData as JsonObject, {
            message: 'No data got returned'
          })
        }

        const returnData: INodePropertyOptions[] = [];
        for (const team of teamData.users) {

          returnData.push({
            name: team.name,
            value: team.id
          })
        }

        sortOptions(returnData)
        return returnData;
      }
    }
  }
}