import axios from "axios";

export class QuestionTypeService {
    API_URL = '/QuestionType/';

    async getQuestionType(id){
        return await axios.get(this.API_URL + 'GetQuestionType?id='+ id);
    }

    async addQuestionType(name){
        return await axios.post(this.API_URL + 'AddQuestionType?name=' + name);
    }

    async loadQuestionTypes(){
        return await axios.get(this.API_URL + 'LoadQuestionTypes');
    }

    async deleteQuestionType(id){
        return await axios.post(this.API_URL + 'DeleteQuestionType?id=' + id);
    }

    async editQuestionType(id, name){
        return await axios.post(this.API_URL + 'EditQuestionType?id=' + id + '&name=' + name);
    }
}