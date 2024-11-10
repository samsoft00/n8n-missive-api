import {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  ILoadOptionsFunctions,
  IPollFunctions
} from "n8n-workflow";

/**
 * Make an API request to Missive
 * 
 */

export async function missiveApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query?: IDataObject,
  uri?: string,
  option: IDataObject = {}
) {
  query = query || {}

  const options: IHttpRequestOptions = {
    headers: {},
    method,
    body: method === 'GET' || method === 'HEAD' || method === 'DELETE' ? null : { data: body },
    qs: query,
    url: uri || `https://public.missiveapp.com/v1${endpoint}`,
    json: true
  }

  if (Object.keys(option).length !== 0) {
    Object.assign(options, option);
  }

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  const authenticationMethod = this.getNodeParameter('authentication', 0) as string;
  return await this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod, options)
}