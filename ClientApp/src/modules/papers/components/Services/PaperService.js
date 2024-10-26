import axios from "axios";

export class PaperService {
    API_URL = '/Paper/';

    async addPaper(paperRequest){
        return await axios.post(this.API_URL + 'AddPaper', paperRequest);
    }

    async getPapers(){
        return await axios.get(this.API_URL + 'GetPapers');
    }

    async deletePaper(id){
        return await axios.post(this.API_URL + 'DeletePaper?id=' + id);
    }

    async updatePaper(id, paperRequest){
        return await axios.post(this.API_URL + 'UpdatePaper?id='+ id , paperRequest);
    }

    async getPaperByVersionId(id){
        return await axios.get(this.API_URL + 'GetPaperByVersionId?id=' + id);
    }

    async submitForApproval(id){
        return await axios.get(this.API_URL + 'SubmitForApproval?id=' + id);
    }

    async getPapersForApproval(){
        return await axios.get(this.API_URL + 'GetPapersForApproval');
    }
}