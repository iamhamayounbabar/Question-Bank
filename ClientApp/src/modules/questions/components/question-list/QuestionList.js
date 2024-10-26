import { Component } from "react"
import { Link, NavLink } from "react-router-dom";
import { QuestionService } from "../../services/QuestionService";
import { NotificationService } from "../../../general/services/Notification.service";

class QuestionList extends Component{
    qService = new QuestionService();
    noti = new NotificationService()
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            questionList: [],
        }
    }

    componentDidMount(){
        this.loadQuestions();
    }

    render(){
        return(
            <>
            <div className="col-md-12 col-xl-12 mx-auto mt-4">
                <div className="accordion accordion-primary" id="accordion">
                    <div className="row">
                        <div className="card card-default">
                            <div className="card-header">
                                <h4 className="card-title m-0">
                                    <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                        List Of Questions
                                    </a>
                                </h4>
                            </div>
                            <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col text-end">
                                            <NavLink className="btn btn-primary" to="/dashboard/add-question">Add Question</NavLink>
                                        </div>
                                    </div>
                                    <div className="row mt-2 mb-3">
                                        <div className="col-lg-12">
                                            <table className="table table-sm table-bordered">
                                                <thead className="table-info text-center">
                                                    <tr>
                                                        <th>Question</th>
                                                        <th>Question Group</th>
                                                        <th>Organization</th>
                                                        <th>Marking Scheme</th>
                                                        <th>Score</th>
                                                        <th>Question Type</th>
                                                        <th>Complexity</th>
                                                        <th>Hint</th>
                                                        <th>Year Group</th>
                                                        <th>Video Link</th>
                                                        <th>Solution</th>
                                                        <th>Question References</th>
                                                        <th>Created By</th>
                                                        <th>Status</th>
                                                        <th style={{ width: '80px' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.getQuestionList()
                                                    } 
                                                    {this.state.questionList.length === 0 && !this.state.loading &&
                                                        <tr>
                                                            <td colSpan={15} className="text-center">No records found</td>
                                                        </tr>
                                                    }
                                                    {this.state.loading && 
                                                        <tr>
                                                            <td colSpan={15} className="text-center">Loading...</td>
                                                        </tr>
                                                    }                                            
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    seperateWords(words){
        return words.replace(/([a-z])([A-Z])/g, "$1 $2");
    }

    loadQuestions = async () => {
        try{
            this.setState({ loading: true });
            const response = await this.qService.getQuestions();
            this.setState({ questionList: response.data, loading: false });
        }
        catch(error){
            this.setState({ loading: false });
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load questions.');
        }
    }

    getQuestionList = () => {
        let questionList = [];
        this.state.questionList.forEach((q, i) => {
            questionList.push(
                <tr key={i}>
                    <td dangerouslySetInnerHTML={{__html: q.question}}></td>
                    <td>{q.questionGroupVersion ? q.questionGroupVersion.title : 'N.A'}</td>
                    <td>{q.organization.name}</td>
                    {!q.markingScheme && <td>N.A</td>}
                    {q.markingScheme && <td dangerouslySetInnerHTML={{__html: q.markingScheme}}></td>}
                    <td>{q.score}</td>
                    <td>{this.seperateWords(q.questionType.name)}</td>
                    <td>{q.complexity.name}</td>
                    {!q.hint && <td>N.A</td>}
                    {q.hint && <td dangerouslySetInnerHTML={{__html: q.hint}}></td>}
                    <td>{q.yearGroup.name}</td>
                    {!q.videoLink && <td>N.A</td>}
                    {q.videoLink && <td>{q.videoLink}</td>}
                    {!q.solution && <td>N.A</td>}
                    {q.solution && <td dangerouslySetInnerHTML={{__html: q.solution}}></td>}
                    {!q.questionReferences && <td>N.A</td>}
                    {q.questionReferences && <td dangerouslySetInnerHTML={{__html: q.questionReferences}}></td>}
                    <td>{q.user.name}</td>
                    <td>{this.seperateWords(q.statusNavigation.name)}</td>
                    <td className="text-center align-middle">
                        <Link to={'/dashboard/edit-question/' + q.id}><i className="fas fa-pencil-alt pointer text-primary fs-5 me-2" /></Link>
                        <i className="far fa-trash-alt pointer text-danger fs-5" onClick={() => this.deleteQuestion(q.questionId, i)}/>
                    </td>
                </tr>
            );
        });
        return questionList;
    }

    deleteQuestion = async (id, index) => {
        try{
            await this.qService.deleteQuestion(id);
            let questionList = this.state.questionList;
            questionList.splice(index, 1);
            this.setState({ questionList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "Question has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }
    
}
export default QuestionList;


