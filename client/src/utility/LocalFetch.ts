
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

const API_PATH = "http://localhost:3000/"

export default async function localFetch(path: string, method: HttpMethod, data?: object): Promise<object> {
  const response = await fetch(API_PATH + path, {
    method: method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : undefined
  });

  return await response.json();

}