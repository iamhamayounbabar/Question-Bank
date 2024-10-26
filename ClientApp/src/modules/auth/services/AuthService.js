import axios from "axios";

export class AuthService {
    API_URL = '/Auth/';

    async loginProcess(user){
        return await axios.post(this.API_URL + 'LoginUser', user);
    }

    async signupProcess(user){
        return await axios.post(this.API_URL + 'RegisterUser', user);
    }

    async isAuthenticated(){
        return await axios.get(this.API_URL + 'IsAuthenticated');
    }

    async getAllNonAdminUsers(){
        return await axios.get(this.API_URL + 'GetAllNonAdminUsers');
    }
}