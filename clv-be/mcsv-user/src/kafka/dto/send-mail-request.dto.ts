export class SendChangePwMailRequest {
  constructor(
    public readonly idToken: string,
    public readonly tempPassword: string,
    public readonly firstName: string,
    public readonly email: string,
    public readonly redirectUrl: string,
  ) {}

  toString() {
    return JSON.stringify({
      idToken: this.idToken,
      tempPassword: this.tempPassword,
      firstName: this.firstName,
      email: this.email,
      redirectUrl: this.redirectUrl,
    });
  }
}
