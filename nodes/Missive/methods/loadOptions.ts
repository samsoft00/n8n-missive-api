import {
  NodeOperationError,
  type IDataObject,
  type ILoadOptionsFunctions,
  type INodePropertyOptions
} from 'n8n-workflow';
import { missiveApiRequest } from '../transport';


export async function getColumns(
  this: ILoadOptionsFunctions
): Promise<INodePropertyOptions[]> {
  const contactID = this.getNodeParameter('');

  const response = await missiveApiRequest.call(this, 'GET', `contacts`);

  const contactData = ((response.contacts as IDataObject[]) || []).find((contact: IDataObject) => {
    return contact.id === contactID;
  });

  if (!contactData) {
    throw new NodeOperationError(this.getNode(), 'Contact information could not be found!', {
      level: 'warning',
    });
  }


  const result: INodePropertyOptions[] = [];

  for (const field of contactData as unknown as IDataObject[]) {
    result.push({
      name: field.name as string,
      value: field.name as string,
      description: `Type: ${field.type}`
    })
  }

  return result;
}

export async function getColumnsWithContactId(
  this: ILoadOptionsFunctions
): Promise<INodePropertyOptions[]> {
  // const returnData = await getColumns.call(this);

  return [
    {
      // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased-id, n8n-nodes-base/node-param-display-name-miscased
      name: 'id',
      value: 'id' as string,
      description: 'Type: primaryFieldId'
    },
    //...returnData
  ]
}