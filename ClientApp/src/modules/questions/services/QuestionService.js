import axios from "axios";

export class QuestionService {
    API_URL = '/Question/';

    async addQuestion(questionRequest){
        return await axios.post(this.API_URL + 'AddQuestion', questionRequest);
    }

    async getQuestions(){
        return await axios.get(this.API_URL + 'GetQuestions');
    }

    async getComplexities(){
        return await axios.get(this.API_URL + 'GetComplexities');
    }

    async getQuestionTypes(){
        return await axios.get(this.API_URL + 'GetQuestionTypes');
    }

    async getQuestionGroups(){
        return await axios.get(this.API_URL + 'GetQuestionGroups');
    }

    async getYearGroups(){
        return await axios.get(this.API_URL + 'GetYearGroups');
    }

    async deleteQuestion(id){
        return await axios.post(this.API_URL + 'DeleteQuestion?id=' + id);
    }
    
    async getQuestionByVersionId(id){
        return await axios.get(this.API_URL + 'GetQuestionByVersionId?id=' + id);
    }

    async updateQuestion(id, questionRequest){
        return await axios.post(this.API_URL + 'UpdateQuestion?id='+ id , questionRequest);
    }

    async submitForApproval(id){
        return await axios.get(this.API_URL + 'SubmitForApproval?id=' + id);
    }

    async getQuestionsForApproval(){
        return await axios.get(this.API_URL + 'GetQuestionsForApproval');
    }

    async markQuestionApproved(id){
        return await axios.get(this.API_URL + 'MarkQuestionApproved?id=' + id);
    }

    async getReviewComment(questionId){
        return await axios.get(this.API_URL + 'GetReviewComment?questionId=' + questionId);
    }

    async addReviewComment(reviewComment, id){
        return await axios.post(this.API_URL + 'AddReviewComment?reviewComment=' +  reviewComment + '&relatedTo=' + id);
    }
}