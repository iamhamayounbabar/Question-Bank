import { Component } from "react"
import { QuestionService } from "../../services/QuestionService";
import { AnswerService } from "../../services/AnswerService";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { NotificationService } from "../../../general/services/Notification.service";
import { SubjectService } from "../../../subjects/services/SubjectService";
import { TopicService } from "../../../topics/services/TopicService";
import { OrganizationService } from "../../../organization/services/OrganizationService";
import { withRouter } from '../../../general/components/withRouter';
import { Button, Modal } from 'antd';
import Multiselect from 'multiselect-react-dropdown';
import { TagService } from "../../../tags/services/TagsService";
import CustomEditor from "../../../general/components/CustomEditor";




class QuestionApprovalDetail extends Component {
    tagService = new TagService();
    qService = new QuestionService();
    sService = new SubjectService();
    tService = new TopicService();
    oService = new OrganizationService();
    aService = new AnswerService();
    noti = new NotificationService();
    constructor(props) {
        super(props);
        this.state = {
            id: props.params.id,
            loading: false,
            approving: false,
            questionId: '',
            openModal: false,
            selectedIndex: -1,
            rejecting: false,
            rejectReason: {
                touched: false,
                value: '',
                error: '',
            },
            question: {
                value: '',
                touched: false,
                error: '',
            },
            hint: {
                value: '',
                touched: false,
                error: '',
            },
            markScheme: {
                value: '',
                touched: false,
                error: '',
            },
            subject: {
                value: '',
                touched: false,
                error: '',
            },
            marks: {
                value: '',
                touched: false,
                error: '',
            },
            topic: {
                value: '',
                touched: false,
                error: '',
            },
            subTopic: {
                value: ''
            },
            complexity: {
                value: '',
                touched: false,
                error: '',
            },
            questionGroup: {
                value: '',
                touched: false,
                error: '',
            },
            organization: {
                value: '',
                touched: false,
                error: '',
            },
            questionType: {
                value: '',
                touched: false,
                error: '',
            },
            yearGroup: {
                value: '',
                touched: false,
                error: '',
            },
            videoLink: {
                value: '',
                touched: false,
                error: '',
            },
            solution: {
                value: '',
                touched: false,
                error: '',
            },
            questionReferences: {
                value: '',
                touched: false,
                error: '',
            },
            topics: [],
            subTopics: [],
            subjects: [],
            organizations: [],
            complexities: [],
            questionGroups: [],
            questionTypes: [],
            yearGroups: [],
            topicsLoaded: false,
            subjectsLoaded: false,
            organizationsLoaded: false,
            complexitiesLoaded: false,
            questionGroupsLoaded: false,
            questionTypesLoaded: false,
            yearGroupsLoaded: false,
            questionLoaded: false,
            tagsLoaded: false,
            answers: [],
            answerSaving: false,
            status: '',
            tags: [],
            options: [],

        }
    }

    componentDidMount() {
        this.loadComplexities();
        this.loadOrganizations();
        this.loadQuestionGroups();
        this.loadSubjects();
        this.loadYearGroups();
        this.loadQuestionTypes();
        this.loadTags();
    }

    componentDidUpdate() {
        if (!this.state.questionLoaded && this.state.complexitiesLoaded
            && this.state.organizationsLoaded && this.state.questionGroupsLoaded && this.state.questionTypesLoaded
            && this.state.yearGroupsLoaded && this.state.subjectsLoaded && this.state.tagsLoaded) {
            this.loadQuestionById();
        }
    }

    render() {
        return (
            <>
                <div className="accordion accordion-primary" id="accordion">
                    <div className="card card-default">
                        <div className="card-header">
                            <h4 className="card-title m-0">
                                <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                    Question Detail
                                </a>
                            </h4>
                        </div>
                        <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                            <div className="card-body">
                                {this.state.status === 'Approved' &&
                                    <div className="row my-3">
                                        <div className="col-12 text-center">
                                            <h3 className="text-danger">Question has been Approved</h3>
                                        </div>
                                    </div>
                                }
                                {this.state.status === 'PendingChanges' &&
                                    <div className="row my-3">
                                        <div className="col-12 text-center">
                                            <h3 className="text-danger">Question has been Rejected</h3>
                                        </div>
                                    </div>
                                }
                                <div className="row">
                                    <div className="col">
                                        <div className="card-body">
                                            <div className="form-group row pb-3">
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Question Details</label>
                                                <div className="col-lg-9">
                                                    <CustomEditor value={this.state.question.value}
                                                        onBlur={(e) => { this.setQuestionTouched(); this.validateQuestion(e.target.value); }}
                                                        onChange={this.validateQuestion}
                                                    />
                                                    {this.state.question.error !== "" && this.state.question.touched &&
                                                        <span className="text-danger">{this.state.question.error}</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Marks</label>
                                    <div className="col-lg-6">
                                        <input name="marks" type="text" className={(this.state.marks.error !== "" && this.state.marks.touched ? "border-danger " : "") + "form-control populate"} value={this.state.marks.value} disabled={true} onBlur={(e) => { this.setMarksTouched(); this.validateMarks(e.target.value); }} onChange={(e) => this.validateMarks(e.target.value)} />
                                        {this.state.marks.error !== "" && this.state.marks.touched &&
                                            <span className="text-danger">{this.state.marks.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Video Link</label>
                                    <div className="col-lg-6">
                                        <input name="marks" type="text" className={(this.state.videoLink.error !== "" && this.state.videoLink.touched ? "border-danger " : "") + "form-control populate"} value={this.state.videoLink.value} disabled={true} />
                                        {this.state.videoLink.error !== "" && this.state.videoLink.touched &&
                                            <span className="text-danger">{this.state.videoLink.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Subject</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.subject.error !== "" && this.state.subject.touched ? "border-danger " : "") + "form-control populate"} value={this.state.subject.value} disabled={true} onBlur={(e) => { this.setSubjectTouched(); this.validateSubject(e.target.value); }} onChange={(e) => this.validateSubject(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getSubjects()
                                            }
                                        </select>
                                        {this.state.subject.error !== "" && this.state.subject.touched &&
                                            <span className="text-danger">{this.state.subject.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Topic</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.topic.error !== "" && this.state.topic.touched ? "border-danger " : "") + "form-control populate"} value={this.state.topic.value} disabled={true} onBlur={(e) => { this.setTopicTouched(); this.validateTopic(e.target.value); }} onChange={(e) => this.validateTopic(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getTopics()
                                            }
                                        </select>
                                        {this.state.topic.error !== "" && this.state.topic.touched &&
                                            <span className="text-danger">{this.state.topic.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Sub Topic</label>
                                    <div className="col-lg-6">
                                        <select disabled={true} className="form-control populate" value={this.state.subTopic.value} onChange={(e) => this.setSubTopic(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getSubTopics()
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Add Tags</label>
                                    <div className="col-lg-6">
                                        <Multiselect
                                            className="shadow-none"
                                            options={this.state.options}
                                            onSelect={this.onTagsUpdate}
                                            onRemove={this.onTagsUpdate}
                                            selectedValues={this.state.tags}
                                            displayValue="name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Coplexity</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.complexity.error !== "" && this.state.complexity.touched ? "border-danger " : "") + "form-control populate"} value={this.state.complexity.value} disabled={true} onBlur={(e) => { this.setComplexityTouched(); this.validateComplexity(e.target.value); }} onChange={(e) => this.validateComplexity(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getComplexities()
                                            }
                                        </select>
                                        {this.state.complexity.error !== "" && this.state.complexity.touched &&
                                            <span className="text-danger">{this.state.complexity.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Question Group</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.questionGroup.error !== "" && this.state.questionGroup.touched ? "border-danger " : "") + "form-control populate"} value={this.state.questionGroup.value} disabled={true} onBlur={(e) => { this.setQuestionGroupTouched(); this.validateQuestionGroup(e.target.value); }} onChange={(e) => this.validateQuestionGroup(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getQuestionGroups()
                                            }
                                        </select>
                                        {this.state.questionGroup.error !== "" && this.state.questionGroup.touched &&
                                            <span className="text-danger">{this.state.questionGroup.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <section className="card">
                                            <div className="card-body">
                                                <form className="form-horizontal form-bordered">
                                                    <div className="form-group row pb-3">
                                                        <label className="col-lg-3 control-label text-lg-end pt-2">Hint</label>
                                                        <div className="col-lg-9">
                                                            <CustomEditor value={this.state.hint.value}
                                                                onBlur={(e) => { this.setHintTouched(); this.validateHint(e.target.value); }}
                                                                onChange={this.validateHint}
                                                            />
                                                            {this.state.hint.error !== "" && this.state.hint.touched &&
                                                                <span className="text-danger">{this.state.hint.error}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Organization</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.organization.error !== "" && this.state.organization.touched ? "border-danger " : "") + "form-control populate"} value={this.state.organization.value} disabled={true} onBlur={(e) => { this.setOrganizationTouched(); this.validateOrganization(e.target.value); }} onChange={(e) => this.validateOrganization(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getOrganizations()
                                            }
                                        </select>
                                        {this.state.organization.error !== "" && this.state.organization.touched &&
                                            <span className="text-danger">{this.state.organization.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row pb-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Year Group </label>
                                    <div className="col-lg-6">
                                        <select disabled={true} className={(this.state.yearGroup.error !== "" && this.state.yearGroup.touched ? "border-danger " : "") + "form-control populate"} value={this.state.yearGroup.value} onBlur={(e) => { this.setYearGroupTouched(); this.validateYearGroup(e.target.value); }} onChange={(e) => this.validateYearGroup(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getYearGroups()
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Question Type</label>
                                    <div className="col-lg-6">
                                        <select disabled={true} className={(this.state.questionType.error !== "" && this.state.questionType.touched ? "border-danger " : "") + "form-control populate"} value={this.state.questionType.value} onBlur={(e) => { this.setQuestionTypeTouched(); this.validateQuestionType(e.target.value); }} onChange={(e) => this.validateQuestionType(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getQuestionTypes()
                                            }
                                        </select>
                                        {this.state.questionType.error !== "" && this.state.questionType.touched &&
                                            <span className="text-danger">{this.state.questionType.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <section className="card">
                                            <div className="card-body">
                                                <form className="form-horizontal form-bordered">
                                                    <div className="form-group row pb-3">
                                                        <label className="col-lg-3 control-label text-lg-end pt-2">Marking Scheme</label>
                                                        <div className="col-lg-9">
                                                            <CustomEditor value={this.state.markScheme.value}
                                                                onBlur={(e) => { this.setMarkSchemeTouched(); this.validateMarkScheme(e.target.value); }}
                                                                onChange={this.validateMarkScheme}
                                                            />
                                                            {this.state.markScheme.error !== "" && this.state.markScheme.touched &&
                                                                <span className="text-danger">{this.state.markScheme.error}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <section className="card">
                                            <div className="card-body">
                                                <form className="form-horizontal form-bordered">
                                                    <div className="form-group row pb-3">
                                                        <label className="col-lg-3 control-label text-lg-end pt-2">Solution</label>
                                                        <div className="col-lg-9">
                                                            <CustomEditor value={this.state.solution.value}
                                                                onBlur={(e) => { this.setSolutionTouched(); this.validateSolution(e.target.value); }}
                                                                onChange={this.validateSolution}
                                                            />
                                                            {this.state.solution.error !== "" && this.state.solution.touched &&
                                                                <span className="text-danger">{this.state.solution.error}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <section className="card">
                                            <div className="card-body">
                                                <form className="form-horizontal form-bordered">
                                                    <div className="form-group row pb-3">
                                                        <label className="col-lg-3 control-label text-lg-end pt-2">Question References</label>
                                                        <div className="col-lg-9">
                                                            <CustomEditor value={this.state.questionReferences.value}
                                                                onBlur={(e) => { this.setQuestionReferencesTouched(); this.validateQuestionReferences(e.target.value); }}
                                                                onChange={this.validateQuestionReferences}
                                                            />
                                                            {this.state.questionReferences.error !== "" && this.state.questionReferences.touched &&
                                                                <span className="text-danger">{this.state.questionReferences.error}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                {this.state.status !== 'Approved' && this.state.status !== 'PendingChanges' &&
                                    <div className="row my-3">
                                        <div className="col-12 text-center">
                                            <button className="btn btn-success" disabled={this.state.loading} onClick={this.markQuestionApprove}>
                                                {this.state.approving &&
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                }
                                                Approved
                                            </button>
                                            <button className="btn btn-warning ms-2" disabled={this.state.approving} onClick={this.openRejectQuestionModal}>
                                                {this.state.rejecting &&
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                }
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {this.state.answers.length > 0 &&
                        <div className="card card-default mb-3">
                            <div className="card-header mt-3">
                                <h4 className="card-title m-0">
                                    <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse2" data-bs-parent="#accordion" data-bs-target="#collapse2">
                                        Manage Answers
                                    </a>
                                </h4>
                            </div>
                            <div id="collapse2" className="collapse show" data-bs-parent="#accordion">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-10 mx-auto">
                                            {
                                                this.getAnswers()
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <Modal
                    title="Reject Question"
                    centered
                    open={this.state.openModal}
                    onOk={() => this.rejectQuestion()}
                    onCancel={() => this.closeRejectModal()}
                    maskClosable={false}
                    footer={[
                        <Button key="Cancel" type={"default"} onClick={() => this.closeRejectModal()}>
                            Cancel
                        </Button>,
                        <Button key="Reject" type={"primary"} disabled={this.state.rejectReason.value === '' ? true : false} className="bg-warning" loading={this.state.rejecting} onClick={() => this.rejectQuestion()}>
                            Reject
                        </Button>
                    ]}
                >
                    <h4>Please write a reason to reject this question.</h4>
                    <textarea className="form-control no-resize" value={this.state.rejectReason.value} onBlur={(e) => { this.setRejectReasonTouched(); this.setRejectReason(e.target.value); }} onChange={(e) => this.setRejectReason(e.target.value)} style={{ height: '30vh' }}></textarea>
                    {this.state.rejectReason.error !== '' && <span className="text-danger">{this.state.rejectReason.error}</span>}
                </Modal>
            </>
        )

    }

    onTagsUpdate = (tagsList, tag) => {
        let tags = tagsList;
        this.setState({ tags });
    }

    loadTags = async () => {
        try {
            const response = await this.tagService.getTags();
            let options = response.data.map(t => {
                return { id: t.id, name: t.tag1 };
            });
            this.setState({ options: options, tagsLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load Tags.');
        }
    }

    markQuestionApprove = async () => {
        try {
            this.setState({ approving: true });
            var response = await this.qService.markQuestionApproved(this.state.id);
            let status = response.data.statusNavigation.name;
            this.setState({ status, approving: false, id: response.data.id });
            this.props.navigate('/dashboard/question-approval-detail/' + response.data.id);
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Question has been approved.')
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to aprroved question.');
            this.setState({ approving: false });
        }
    }

    markAnswerApprove = async () => {
        debugger
        try {
            this.setState({ approving: true });
            var response = await this.qService.markQuestionApproved(this.state.id,this.state.answers);
            let status = response.data.statusNavigation.name;
            this.setState({ status, approving: false, id: response.data.id });
            this.props.navigate('/dashboard/question-approval-detail/' + response.data.id);
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Answer has been approved.')
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to aprroved answer.');
            this.setState({ approving: false });
        }
    }

    seperateWords(words) {
        return words.replace(/([a-z])([A-Z])/g, "$1 $2");
    }

    setRejectReason = (reason) => {
        let rejectReason = this.state.rejectReason;
        rejectReason.value = reason;
        if (reason === "") {
            rejectReason.error = 'Rejection reason is required.'
            this.setState({ rejectReason });
        }
        else {
            rejectReason.error = '';
            this.setState({ rejectReason });
        }
    }

    rejectQuestion = async () => {
        try {
            this.setState({ rejecting: true });
            var response = await this.qService.addReviewComment(this.state.rejectReason.value, this.state.questionId);
            this.setState({ status: response.data.statusNavigation.name, id: response.data.id, rejecting: false });
            this.closeRejectModal();
            this.props.navigate('/dashboard/question-approval-detail/' + response.data.id);
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Question has been rejected.');
        }
        catch (err) {
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            this.setState({ rejecting: false });
        }

    }

    openRejectQuestionModal = (index) => {
        this.setState({ openModal: true, selectedIndex: index });
    }

    closeRejectModal = () => {
        let rejectReason = {
            touched: false,
            value: '',
            error: ''
        }
        this.setState({ openModal: false, selectedIndex: -1, rejectReason });
    }

    setRejectReasonTouched = () => {
        let rejectReason = this.state.rejectReason;
        rejectReason.touched = true;
        this.setState({ rejectReason });
    }

    checkAnswersValidation = () => {
        if ((this.state.questionType.value === 7 || this.state.questionType.value === 6
            || this.state.questionType.value === 4 || this.state.questionType.value === 1
            || this.state.questionType.value === 5 || this.state.questionType.value === 8
            || this.state.questionType.value === 9)
            && this.state.answers.filter(f => f.error === '' && f.touched).length > 0) {
            return true;
        }
        return false;
    }

    // saveAnswers = async () => {
    //     try {
    //         if (!this.checkAnswersValidation()) return;
    //         this.setState({ answerSaving: true });
    //         const response = await this.aService.addUpdateAnswers(this.state.questionId, this.state.answers);
    //         this.setState({ answerSaving: false }, () => {
    //             let answers = [];
    //             for (var i = 0; i < response.data.length; i++) {
    //                 if (this.state.questionType.value === 5 || this.state.questionType.value === 8 || this.state.questionType.value === 9) {
    //                     let ans = {
    //                         ansId: response.data[i].id, ansCode: response.data[i].answerCode,
    //                         ans: response.data[i].answer, isCorrect: response.data[i].isCorrectAnswer,
    //                         disabled: false
    //                     };
    //                     answers.push(ans);
    //                 }
    //                 else {
    //                     let ans = {
    //                         ansId: response.data[i].id, ansCode: response.data[i].answerCode,
    //                         ans: response.data[i].answer, isCorrect: response.data[i].isCorrectAnswer, 
    //                         disabled: false };
    //                     answers.push(ans);
    //                 }
    //             }
    //             this.setState({ answers });
    //         });
    //         this.noti.sendNotification(this.noti.types.success, 'Success', 'Answer has been updated.')
    //     }
    //     catch (err) {
    //         this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to save answers.');
    //         this.setState({ answerSaving: false });
    //     }
    // }

    // questionTypes : True/False , Short Answer, Eassy & Diagram
    // addAnswers = () => {
    //     let answers = this.state.answers;
    //     if (this.state.questionType.value === 7) {
    //         let ans1 = { ansId: undefined, ansCode: '', ans: 'True', isCorrect: false, error: '', touched: false, disabled: false };
    //         let ans2 = { ansId: undefined, ansCode: '', ans: 'False', isCorrect: false, error: '', touched: false, disabled: false };
    //         answers.push(ans1);
    //         answers.push(ans2);
    //     }
    //     else if (this.state.questionType.value === 5 || this.state.questionType.value === 8 || this.state.questionType.value === 9) {
    //         let ans = { ansId: undefined, ansCode: '', ans: ' ', isCorrect: true, error: '', touched: false, disabled: false }
    //         answers.push(ans);
    //     }
    //     this.setState({ answers });
    // }

    // questionTypes : multiple Choice , check List & List
    // insertAnswer = () => {
    //     let answers = this.state.answers;
    //     if (this.state.questionType.value === 6 || this.state.questionType.value === 4 || this.state.questionType.value === 1) {
    //         let insert = { ansId: undefined, ansCode: '', ans: '', isCorrect: false, error: '', touched: false, disabled: false };
    //         answers.push(insert);
    //     }
    //     this.setState({ answers });
    // }

    getAnswers = () => {
        let answers = [];
        answers.push(
            <div className="row">
                <div className="col">
                    <h4 className="fw-bold m-0">These are the answers added, approve or reject each answer accordingly.</h4>
                </div>
            </div>
        );
        this.state.answers.forEach((a, i) => {
            if (this.state.questionType.value === 7) {
                answers.push(
                    <div className="row align-items-center" key={i}>
                        <div className="col mt-3">
                            <h4 className="m-0 fw-bold">This is what user will see</h4>
                            <h4 className="m-0">{a.ans}</h4>
                        </div>
                        <div className="col mt-3">
                            <h4 className="m-0 fw-bold">Is this the correct answer?</h4>
                            <div className="radio-custom">
                                <input type="radio" disabled={true} checked={a.isCorrect} onChange={(e) => this.setAnswerState(i, e.target.checked)} id={"ans" + i} />
                                <label className="fs-6" htmlFor={"ans" + i}>Is Correct</label>
                            </div>

                        </div>
                    </div>
                );
            }
            else if (this.state.questionType.value === 5 || this.state.questionType.value === 8 || this.state.questionType.value === 9) {
                answers.push(
                    <div className="row align-items-center" key={i}>
                        <label className="col-lg-3 control-label text-lg-end pt-2">
                            {this.state.questionType.value === 5 && 'Write a short answer.'}
                            {this.state.questionType.value === 8 && 'Write an essay.'}
                            {this.state.questionType.value === 9 && 'Add your diagrams.'}
                        </label>
                        <div className="col-lg-9">
                            <CustomEditor value={a.value}
                                onBlur={() => { this.setAnswerTouchedState(); }}
                                onChange={(e) => this.setAnswerState(i, e)}
                                placeholder={this.state.questionType.value === 9 ? 'Add diagrams here...' : 'Write here...'}
                            />
                        </div>
                    </div>
                )
            }
            else if (this.state.questionType.value === 6 || this.state.questionType.value === 4 || this.state.questionType.value === 1) {
                answers.push(
                    <div className="row align-items-center" key={i}>
                        <div className="col mt-3">
                            <h4 className="m-0 fw-bold">Enter Your Answer</h4>
                            <input type="text" className={(this.state.answers.error !== "" && this.state.answers.touched ? "border-danger " : "") + "form-control populate"} value={a.ans} disabled={true} onBlur={(e) => { this.setAnswerTouchedState(i); this.setAnswerState(i, e.target.value); }} onChange={(e) => this.setAnswerState(i, e.target.value)}
                            />
                            {a.error !== "" && a.touched &&
                                <span className="text-danger">{a.error}</span>
                            }
                        </div>
                        <div className="col mt-3">
                            <h4 className="m-0 fw-bold">Is this the correct answer?</h4>
                            {this.state.questionType.value !== 1 &&
                                <div className="checkbox-custom checkbox-default">
                                    <input type="checkbox" disabled={true} checked={a.isCorrect} onChange={(e) => this.setAnswerState(i, e.target.checked)} id={"ans" + i} />
                                    <label className="fs-6" htmlFor={"ans" + i}>Is Correct</label>
                                </div>
                            }
                            {this.state.questionType.value === 1 &&
                                <div className="radio">
                                    <label htmlFor={"ans" + i} className="fs-6">
                                        <input className="me-2 fs-4" type="radio" disabled={true} checked={a.isCorrect} onChange={(e) => this.setAnswerState(i, e.target.checked)} id={"ans" + i} />
                                        Is Correct
                                    </label>
                                    <button className="btn btn-success ms-5" disabled={this.state.approving} onClick={this.markAnswerApprove}><i className="fas fa-check pointer"></i>
                                        {this.state.approving &&
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        }
                                    </button>
                                    <button className="btn btn-warning ms-2" disabled={this.state.rejecting} onClick={this.openRejectQuestionModal}><i className="fas fa-times pointer fs-6"></i>
                                        {this.state.rejecting &&
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        }
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                )
            }
        });
        return answers;
    }

    setAnswerTouchedState = (i) => {
        let answers = this.state.answers;
        answers[i].touched = true;
        this.setState({ answers });
    }

    setAnswerCodeState = (i, value) => {
        if (this.state.answerSaving) return;
        let answers = this.state.answers;
        answers[i].ans = value;
        if (value === "") {
            answers[i].error = 'Answer code is required.';
        } else {
            answers[i].error = '';
        }
        this.setState({ answers });
    }

    setAnswerState = (i, value) => {
        if (this.state.answerSaving) return;
        let answers = this.state.answers;
        if (this.state.questionType.value === 7) {
            for (let i = 0; i < answers.length; i++) {
                answers[i].isCorrect = false;
            }
            answers[i].isCorrect = true;
            answers[i].touched = true;
        }
        else if (this.state.questionType.value === 5 || this.state.questionType.value === 8 || this.state.questionType.value === 9) {
            answers[i].value = value;
            if (value !== '') {
                answers[i].error = '';
            }
            else {
                answers[i].error = 'Answer is required.';
            }
        }
        else if (this.state.questionType.value === 6 || this.state.questionType.value === 4) {
            if (typeof (value) === "string") {
                answers[i].ans = value;
                if (value === "") {
                    answers[i].error = 'Answer is required.';
                } else {
                    answers[i].error = '';
                }
            }
            else {
                answers[i].isCorrect = value;
            }
        }
        else if (this.state.questionType.value === 1) {
            if (typeof (value) === "string") {
                answers[i].ans = value;
                if (value === "") {
                    answers[i].error = 'Answer is required.';
                } else {
                    answers[i].error = '';
                }
            }
            else {
                for (let i = 0; i < answers.length; i++) {
                    answers[i].isCorrect = false;
                }
                answers[i].isCorrect = true;
            }
        }
        this.setState({ answers });
    }

    loadQuestionById = async () => {
        try {
            const response = await this.qService.getQuestionByVersionId(this.state.id);
            this.setState({ questionLoaded: true }, () => {
                this.setQuestionValues(response.data);
            });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load questions.');
        }
    }

    setQuestionValues = (questionV) => {
        let question = this.state.question;
        let hint = this.state.hint;
        let markScheme = this.state.markScheme;
        let subject = this.state.subject;
        let marks = this.state.marks;
        let videoLink = this.state.videoLink;
        let solution = this.state.solution;
        let questionReferences = this.state.questionReferences;
        let topic = this.state.topic;
        let subTopic = this.state.subTopic;
        let complexity = this.state.complexity;
        let questionGroup = this.state.questionGroup;
        let organization = this.state.organization;
        let questionType = this.state.questionType;
        let yearGroup = this.state.yearGroup;
        let status = questionV.statusNavigation.name;
        let tags = questionV.tags;

        question.value = questionV.question;
        hint.value = questionV.hint;
        solution.value = questionV.solution;
        questionReferences.value = questionV.questionReferences;
        markScheme.value = questionV.markingScheme;
        videoLink.value = questionV.videoLink;
        marks.value = questionV.score;
        complexity.value = questionV.complexityId;
        questionGroup.value = questionV.questionGroupId;
        organization.value = questionV.organizationId;
        questionType.value = questionV.questionTypeId;
        yearGroup.value = questionV.yearGroupId;
        subject.value = questionV.topic.subjectId;
        tags = questionV.tags;

        this.tService.loadTopics(questionV.topic.subjectId).then(res => {
            const topics = res.data;
            let subTopics = [];
            this.setState({ topics }, () => {
                if (!questionV.topic.parentTopic) {
                    topic.value = questionV.topicId;
                    subTopics = topics.filter(f => f.parentTopic === topic.value);
                }
                else {
                    subTopic.value = questionV.topicId;
                    let topicT = this.state.topics.find(f => f.id === questionV.topic.parentTopic);
                    topic.value = topicT.id;
                    subTopics = topics.filter(f => f.parentTopic === topic.value);
                }
                this.setState({ subTopics }, () => {
                    this.setState({ question, tags, status, hint, videoLink, solution, questionReferences, markScheme, subject, marks, topic, subTopic, complexity, questionGroup, organization, questionType, yearGroup, questionId: questionV.questionId }, () => {
                        if (!questionV.answers || questionV.answers.length <= 0) {
                            //this.addAnswers();
                        }
                        else {
                            let answers = [];
                            questionV.answers.forEach(answer => {
                                if (this.state.questionType.value === 5 || this.state.questionType.value === 8 || this.state.questionType.value === 9) {
                                    let ans = {
                                        ansId: answer.id, ansCode: answer.answerCode,
                                        ans: answer.answer, isCorrect: answer.isCorrectAnswer,
                                        disabled: false
                                    };
                                    answers.push(ans);
                                }
                                else {
                                    let ans = { ansId: answer.id, ansCode: answer.answerCode, ans: answer.answer, isCorrect: answer.isCorrectAnswer, error: '', touched: true, disabled: false };
                                    answers.push(ans);
                                }
                            });
                            this.setState({ answers });
                        }
                    });
                });
            });
        }).catch(error => {
            console.log(error);
        });
    }



    loadSubjects = async () => {
        try {
            const response = await this.sService.getSubjectsByUser(true);
            this.setState({ subjects: response.data, subjectsLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load subjects.');
        }
    }

    loadTopics = async (subjectId) => {
        try {
            const response = await this.tService.getTopics(subjectId);
            this.setState({ topics: response.data, topicsLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load topics.');
        }
    }

    loadSubTopics = () => {
        let subTopics = this.state.topics.filter(f => f.parentTopic === this.state.topic.value);
        let subTopic = {
            value: ''
        };
        this.setState({ subTopics, subTopic });
    }

    loadOrganizations = async () => {
        try {
            const response = await this.oService.getOrganizations();
            this.setState({ organizations: response.data, organizationsLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load organizations.');
        }
    }

    loadYearGroups = async () => {
        try {
            const response = await this.qService.getYearGroups();
            this.setState({ yearGroups: response.data, yearGroupsLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load year groups.');
        }
    }

    loadQuestionGroups = async () => {
        try {
            const response = await this.qService.getQuestionGroups();
            this.setState({ questionGroups: response.data, questionGroupsLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load question groups.');
        }
    }

    loadQuestionTypes = async () => {
        try {
            const response = await this.qService.getQuestionTypes();
            this.setState({ questionTypes: response.data, questionTypesLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load question types.');
        }
    }

    loadComplexities = async () => {
        try {
            const response = await this.qService.getComplexities();
            this.setState({ complexities: response.data, complexitiesLoaded: true });
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load complexities.');
        }
    }

    getComplexities = () => {
        let complexities = [];
        this.state.complexities.forEach((complexity, i) => {
            complexities.push(
                <option key={i} value={complexity.id}>{complexity.name}</option>
            );
        });
        return complexities;
    }

    getQuestionTypes = () => {
        let questionTypes = [];
        this.state.questionTypes.forEach((questionType, i) => {
            questionTypes.push(
                <option key={i} value={questionType.id}>{this.seperateWords(questionType.name)}</option>
            );
        });
        return questionTypes;
    }

    getSubjects = () => {
        let subjects = [];
        this.state.subjects.forEach((subject, i) => {
            subjects.push(
                <option key={i} value={subject.id}>{subject.name}</option>
            );
        });
        return subjects;
    }

    getTopics = () => {
        let topics = [];
        this.state.topics.filter(f => !f.parentTopic).forEach((topic, i) => {
            topics.push(
                <option key={i} value={topic.id}>{topic.name}</option>
            );
        });
        return topics;
    }

    getSubTopics = () => {
        let subTopics = [];
        this.state.subTopics.forEach((topic, i) => {
            subTopics.push(
                <option key={i} value={topic.id}>{topic.name}</option>
            );
        });
        return subTopics;
    }

    getQuestionGroups = () => {
        let questionGroups = [];
        this.state.questionGroups.forEach((questionGroup, i) => {
            questionGroups.push(
                <option key={i} value={questionGroup.id}>{questionGroup.name}</option>
            );
        });
        return questionGroups;
    }

    getOrganizations = () => {
        let organizations = [];
        this.state.organizations.forEach((organization, i) => {
            organizations.push(
                <option key={i} value={organization.id}>{organization.name}</option>
            );
        });
        return organizations;
    }

    getYearGroups = () => {
        let yearGroups = [];
        this.state.yearGroups.forEach((yearGroup, i) => {
            yearGroups.push(
                <option key={i} value={yearGroup.id}>{yearGroup.name}</option>
            );
        });
        return yearGroups;
    }

    //Validators
    validateQuestion = (value) => {
        let question = this.state.question;
        question.value = value;
        if (value !== '') {
            question.error = '';
            this.setState({ question });
        }
        else {
            question.error = 'Question is required.';
            this.setState({ question });
        }
    }

    setQuestionTouched = () => {
        let question = this.state.question;
        question.touched = true;
        this.setState({ question });
    }

    validateHint = (value) => {
        let hint = this.state.hint;
        hint.value = value;
        if (value !== '') {
            hint.error = '';
            this.setState({ hint });
        }
        else {
            // hint.error = 'Hint is required.';
            this.setState({ hint });
        }
    }

    setHintTouched = () => {
        let hint = this.state.hint;
        hint.touched = true;
        this.setState({ hint });
    }

    setMarkSchemeTouched = () => {
        let markScheme = this.state.markScheme;
        markScheme.touched = true;
        this.setState({ markScheme });
    }

    validateMarkScheme = (value) => {
        let markScheme = this.state.markScheme;
        markScheme.value = value;
        if (value !== '') {
            markScheme.error = '';
            this.setState({ markScheme });
        }
        else {
            // markScheme.error = 'Mark Scheme is required.';
            this.setState({ markScheme });
        }
    }

    validateSolution = (value) => {
        let solution = this.state.solution;
        solution.value = value;
        if (value !== '') {
            solution.error = '';
            this.setState({ solution });
        }
        else {
            // solution.error = 'Solution is required.';
            this.setState({ solution });
        }
    }

    setSolutionTouched = () => {
        let solution = this.state.solution;
        solution.touched = true;
        this.setState({ solution });
    }

    setQuestionReferencesTouched = () => {
        let questionReferences = this.state.questionReferences;
        questionReferences.touched = true;
        this.setState({ questionReferences });
    }

    validateQuestionReferences = (value) => {
        let questionReferences = this.state.questionReferences;
        questionReferences.value = value;
        if (value !== '') {
            questionReferences.error = '';
            this.setState({ questionReferences });
        }
        else {
            // questionReferences.error = 'Question References Scheme is required.';
            this.setState({ questionReferences });
        }
    }

    validateMarks = (value) => {
        let marks = this.state.marks;
        marks.value = value;
        if (value === "") {
            marks.error = 'Marks is required.'
            this.setState({ marks });
        }
        else {
            marks.error = '';
            this.setState({ marks });
        }
    }

    setMarksTouched = () => {
        let marks = this.state.marks;
        marks.touched = true;
        this.setState({ marks });
    }

    validateSubject = (value) => {
        let subject = this.state.subject;
        subject.value = value;
        if (value === "") {
            subject.error = 'Subject is required.'
            this.setState({ subject });
        }
        else {
            subject.error = '';
            this.setState({ subject }, () => {
                this.loadTopics(subject.value);
            });
        }
    }

    setSubjectTouched = () => {
        let subject = this.state.subject;
        subject.touched = true;
        this.setState({ subject });
    }

    validateTopic = (value) => {
        let topic = this.state.topic;
        topic.value = value;
        if (value === "") {
            topic.error = 'Topic is required.'
            this.setState({ topic });
        }
        else {
            topic.error = '';
            this.setState({ topic }, () => {
                this.loadSubTopics();
            });
        }
    }

    setTopicTouched = () => {
        let topic = this.state.topic;
        topic.touched = true;
        this.setState({ topic });
    }

    setSubTopic = (value) => {
        let subTopic = this.state.subTopic;
        subTopic.value = value;
        this.setState({ subTopic });
    }

    validateComplexity = (value) => {
        let complexity = this.state.complexity;
        complexity.value = value;
        if (value === "") {
            complexity.error = 'Complexity is required.'
            this.setState({ complexity });
        }
        else {
            complexity.error = '';
            this.setState({ complexity });
        }
    }

    setComplexityTouched = () => {
        let complexity = this.state.complexity;
        complexity.touched = true;
        this.setState({ complexity });
    }

    validateYearGroup = (value) => {
        let yearGroup = this.state.yearGroup;
        yearGroup.value = value;
        if (value === "") {
            yearGroup.error = 'Complexity is required.'
            this.setState({ yearGroup });
        }
        else {
            yearGroup.error = '';
            this.setState({ yearGroup });
        }
    }

    setYearGroupTouched = () => {
        let yearGroup = this.state.yearGroup;
        yearGroup.touched = true;
        this.setState({ yearGroup });
    }

    validateQuestionGroup = (value) => {
        let questionGroup = this.state.questionGroup;
        questionGroup.value = value;
        // if (value === "") {
        //     questionGroup.error = 'Question Group is required.'
        //     this.setState({ questionGroup });
        // }
        // else {
        //     questionGroup.error = '';
        //     this.setState({ questionGroup });
        // }
    }

    setQuestionGroupTouched = () => {
        let questionGroup = this.state.questionGroup;
        questionGroup.touched = true;
        this.setState({ questionGroup });
    }

    validateOrganization = (value) => {
        let organization = this.state.organization;
        organization.value = value;
        if (value === "") {
            organization.error = 'Organization is required.'
            this.setState({ organization });
        }
        else {
            organization.error = '';
            this.setState({ organization });
        }
    }

    setOrganizationTouched = () => {
        let organization = this.state.organization;
        organization.touched = true;
        this.setState({ organization });
    }

    validateQuestionType = (value) => {
        let questionType = this.state.questionType;
        questionType.value = value;
        if (value === "") {
            questionType.error = 'Question Type is required.'
            this.setState({ questionType });
        }
        else {
            questionType.error = '';
            this.setState({ questionType });
        }
    }

    setQuestionTypeTouched = () => {
        let questionType = this.state.questionType;
        questionType.touched = true;
        this.setState({ questionType });
    }
}

export default withRouter(QuestionApprovalDetail);