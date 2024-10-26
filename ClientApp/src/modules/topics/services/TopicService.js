import axios from "axios";

export class TopicService {
    API_URL = '/Topic/';

    async getTopics(id){
        return await axios.get(this.API_URL + 'GetTopics?id=' + id);
    }
    
    async addTopic(name, parentTopicId, subjectId){
        return await axios.post(this.API_URL + 'AddTopic?name=' + name + '&parentTopicId=' + parentTopicId + '&subjectId=' + subjectId);
    }

    async loadTopics(){
        return await axios.get(this.API_URL + 'LoadTopics');
    }

    async deleteTopic(id){
        return await axios.get(this.API_URL + 'DeleteTopic?id=' + id);
    }

}