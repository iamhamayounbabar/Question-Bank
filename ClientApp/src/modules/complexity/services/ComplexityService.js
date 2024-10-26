import axios from "axios";

export class ComplexityService {
    API_URL = '/Complexity/';

    async getComplexity(id){
        return await axios.get(this.API_URL + 'GetComplexity?id='+ id);
    }

    async addComplexity(name){
        return await axios.post(this.API_URL + 'AddComplexity?name=' + name);
    }

    async loadComplexity(){
        return await axios.get(this.API_URL + 'LoadComplexity');
    }

    async deleteComplexity(id){
        return await axios.post(this.API_URL + 'DeleteComplexity?id=' + id);
    }

    async editComplexity(id, name){
        return await axios.post(this.API_URL + 'EditComplexity?id=' + id + '&name=' + name);
    }
}