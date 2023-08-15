import { AUTH, NOTI, USER } from '@common/app.constants';

export function ServiceMapping(path: string): string {
  const [, serviceName] = path.split('/');
  switch (serviceName) {
    case AUTH:
    case USER:
      return process.env.USER_PORT;
    case NOTI:
      return process.env.NOTI_PORT;
    default:
      return process.env.GATEWAY_PORT;
  }
}
