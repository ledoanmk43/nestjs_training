import { Injectable } from '@nestjs/common';
import { ResetPwDto } from '@user/dto';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsDifferentPassword', async: false })
@Injectable()
export class IsDifferentPassword implements ValidatorConstraintInterface {
  validate(newPassword: string, args: any) {
    const { currentPassword } = args.object as ResetPwDto;
    return newPassword !== currentPassword;
  }

  defaultMessage() {
    return 'New password must be different from the current password.';
  }
}
