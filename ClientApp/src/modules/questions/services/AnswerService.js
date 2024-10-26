import axios from "axios";

export class AnswerService {
    API_URL = '/Answer/';

    async addUpdateAnswers(id, answers){
        return await axios.post(this.API_URL + 'AddUpdateAnswers?id=' + id , answers);
    }
    async markAnswerApproved(id,answers){
        return await axios.get(this.API_URL + 'MarkQuestionApproved?id=' + id , answers);
    }
}