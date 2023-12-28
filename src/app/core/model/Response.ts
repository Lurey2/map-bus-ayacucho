
export interface Response<T> {
  status : string ;
  data? : T;
  error? : Error;
  Code? : number;
}

export interface Error{
  message? :string ,
  type? : string
}

export const Status  = {
  OK : "success",
  Error : "error"
}
