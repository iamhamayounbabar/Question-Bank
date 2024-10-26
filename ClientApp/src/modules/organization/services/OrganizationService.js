import axios from "axios";

export class OrganizationService {
    API_URL = '/Organization/';

    async getOrganizations(){
        return await axios.get(this.API_URL + 'GetOrganizations');
    }

    async addOrganization(name, logo, website, copyright){
        return await axios.post(this.API_URL + 'AddOrganization?name=' + name + '&logo=' + logo + '&website=' + website + '&copyright=' + copyright);
    }

    async deleteOrganization(id){
        return await axios.post(this.API_URL + 'DeleteOrganization?id=' + id);
    }

    async editOrganization(id, name, logo, website, copyright){
        return await axios.post(this.API_URL + 'EditOrganization?id=' + id + '&name=' + name + '&logo=' + logo + '&website=' + website + '&copyright=' + copyright);
    }
}