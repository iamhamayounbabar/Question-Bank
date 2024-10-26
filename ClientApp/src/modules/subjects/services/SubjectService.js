import axios from "axios";

export class SubjectService {
    API_URL = '/Subject/';

    async getSubjectsByUser(showAll = false){
        return await axios.get(this.API_URL + 'GetSubjectsByUser?showAll=' + showAll);
    }

    async addSubject(name){
        return await axios.post(this.API_URL + 'AddSubject?name=' + name);
    }

    async loadSubjects(){
        return await axios.get(this.API_URL + 'LoadSubjects');
    }

    async deleteSubject(id){
        return await axios.get(this.API_URL + 'DeleteSubject?id=' + id);
    }

    async editSubject(id, name){
        return await axios.post(this.API_URL + 'editSubject?id=' + id + '&name=' + name);
    }

    async assignSubject(userId, subjectId){
        return await axios.post(this.API_URL + 'AssignSubject?userId=' + userId + '&subjectId=' + subjectId);
    }

    async loadAssignedSubjects(){
        return await axios.get(this.API_URL + 'LoadAssignedSubjects');
    }

    async unassignSubject(id){
        return await axios.get(this.API_URL + 'UnassignSubject?id=' + id);
    }
}