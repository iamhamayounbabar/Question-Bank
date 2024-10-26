import axios from "axios";

export class PaperTypeService{
    API_URL = '/PaperType/';

    async getPaperType(id){
        return await axios.get(this.API_URL + 'GetPaperType?id='+ id);
    }

    async addPaperType(name){
        return await axios.post(this.API_URL + 'AddPaperType?name=' + name);
    }

    async loadPaperTypes(){
        return await axios.get(this.API_URL + 'LoadPaperTypes');
    }

    async deletePaperType(id){
        return await axios.post(this.API_URL + 'DeletePaperType?id=' + id);
    }

    async editPaperType(id, name){
        return await axios.post(this.API_URL + 'EditPaperType?id=' + id + '&name=' + name);
    }
}