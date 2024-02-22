//data collected and sent when user logins
export class LoginData {
    constructor(
        public userEmail: string,
        public userCountryCode: string,
        public userMobile: string
    ) { }
}
