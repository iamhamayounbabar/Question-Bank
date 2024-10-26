import axios from "axios";

export class TagService {
    API_URL = '/Tag/';

    async getTags(){
        return await axios.get(this.API_URL + 'GetTags');
    }

    async addTag(name){
        return await axios.post(this.API_URL + 'AddTag?name=' + name);
    }

    async loadTags(){
        return await axios.get(this.API_URL + 'LoadTags');
    }

    async deleteTag(id){
        return await axios.get(this.API_URL + 'DeleteTag?id=' + id);
    }

    async editTag(id, name){
        return await axios.post(this.API_URL + 'editTag?id=' + id + '&name=' + name);
    }
}