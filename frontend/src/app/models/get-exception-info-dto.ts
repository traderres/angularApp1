export class GetExceptionInfoDTO {
  public id: number;
  public user_name: string;
  public user_full_name: string;
  public app_name: string;
  public app_version: string;
  public url: string;
  public event_date: string;
  public message: string;
  public cause: string;
  public stack_trace: string;
}
