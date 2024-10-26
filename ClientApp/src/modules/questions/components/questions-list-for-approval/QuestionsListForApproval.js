import { Component } from "react"
import { QuestionService } from "../../services/QuestionService";
import { NotificationService } from "../../../general/services/Notification.service";
// import { Button, Modal } from 'antd';
import { Link } from "react-router-dom";



class QuestionListForApproval extends Component{
    qService = new QuestionService();
    noti = new NotificationService()
    constructor(props){
        super(props);
        this.state = {
            approving: false,
            loading: false,
            questionList: [],
            // openModal: false,
            // selectedIndex: -1,
            // rejecting: false,
            // rejectReason: {
            //     touched: false,
            //     value: '',
            //     error: ''
            // }
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
                                                        <th style={{width: '80px'}}>Action</th>
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
            const response = await this.qService.getQuestionsForApproval();
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
                        <Link to={'/dashboard/question-approval-detail/'+ q.id}><i className="fas fa-file-alt pointer text-primary fs-5 me-2" /></Link>
                    </td>
                </tr>
            );
        });
        return questionList;
    }
}
export default QuestionListForApproval;


