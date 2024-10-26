import axios from "axios";

export class QuestionGroupService {
    API_URL = '/QuestionGroup/';

    async addQuestionGroup(questionGroupRequest){
        return await axios.post(this.API_URL + 'AddQuestionGroup', questionGroupRequest);
    }

    async deleteQuestionGroups(id){
        return await axios.post(this.API_URL + 'DeleteQuestionGroup?id=' + id);
    }

    async updateQuestionGroup(id, questionGroupRequest){
        return await axios.post(this.API_URL + 'UpdateQuestionGroup?id='+ id , questionGroupRequest);
    }

    async getQuestionGroups(){
        return await axios.get(this.API_URL + 'GetQuestionGroups');
    }

    async getQuestionGroupByVersionId(id){
        return await axios.get(this.API_URL + 'GetQuestionGroupByVersionId?id=' + id);
    }
}