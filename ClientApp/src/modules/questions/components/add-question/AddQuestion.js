import React, { Component } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { QuestionService } from "../../services/QuestionService";
import { NotificationService } from "../../../general/services/Notification.service";
import { SubjectService } from "../../../subjects/services/SubjectService";
import { TopicService } from "../../../topics/services/TopicService";
import { OrganizationService } from "../../../organization/services/OrganizationService";
import Multiselect from 'multiselect-react-dropdown';
import { TagService } from "../../../tags/services/TagsService";
import CustomEditor from "../../../general/components/CustomEditor";
import { withRouter } from '../../../general/components/withRouter';

class AddQuestion extends Component {
    tagService = new TagService();
    qService = new QuestionService();
    sService = new SubjectService();
    tService = new TopicService();
    oService = new OrganizationService();
    noti = new NotificationService();
    constructor(props){
		super(props);
		this.state = {
            loading: false,
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
            subject: {
                value: '',
                touched: false,
                error:'',
            },
            marks: {
                value: '',
                touched: false,
                error:'',
            },
            videoLink: {
                value: '',
                touched: false,
                error:'',
            },
            topic: {
                value: '',
                touched: false,
                error:'',
            },
            subTopic: {
                value: ''
            },
            complexity: {
                value: '',
                touched: false,
                error:'',
            },
            questionGroup: {
                value: props.params.id ?? '',
                touched: false,
                error:'',
            },
            organization: {
                value: '',
                touched: false,
                error:'',
            },
            questionType: {
                value: '',
                touched: false,
                error:'',
            },
            yearGroup: {
                value: '',
                touched: false,
                error:'',
            },
            tags: [],
            options: [],
            topics: [],
            subTopics: [],
            subjects: [],
            organizations: [],
            complexities: [],
            questionGroups: [],
            questionTypes: [],
            yearGroups: []
		}
	}

    componentDidMount(){
        this.loadComplexities();
        this.loadOrganizations();
        this.loadQuestionGroups();
        this.loadQuestionTypes();
        this.loadSubjects();
        this.loadYearGroups();
        this.loadTags();
    }

    resetForm = () => {
        let state = {
            loading: false,
            question: {
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
            videoLink: {
                value: '',
                touched: false,
                error:'',
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
                error:'',
            },
            marks: {
                value: '',
                touched: false,
                error:'',
            },
            topic: {
                value: '',
                touched: false,
                error:'',
            },
            subTopic: {
                value: ''
            },
            complexity: {
                value: '',
                touched: false,
                error:'',
            },
            questionGroup: {
                value: this.props.params.id ?? '',
                touched: false,
                error:'',
            },
            organization: {
                value: '',
                touched: false,
                error:'',
            },
            questionType: {
                value: '',
                touched: false,
                error:'',
            },
            yearGroup: {
                value: '',
                touched: false,
                error:'',
            },
            tags: []
		};
        this.setState({...state});
    }

    render(){
        return(
            <>
                <div className="accordion accordion-primary" id="accordion">
                    <div className="card card-default">
                        <div className="card-header">
                            <h4 className="card-title m-0">
                                <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                    Add Question
                                </a>
                            </h4>
                        </div>
                        <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="card-body">
                                            <div className="form-group row pb-3">
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Question Details</label>
                                                <div className="col-lg-9">
                                                    <CustomEditor value={this.state.question.value} 
                                                    onBlur={(e) => {this.setQuestionTouched(); this.validateQuestion(e.target.value);}} 
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
                                        <input name="marks" type="text" className={(this.state.marks.error !== "" && this.state.marks.touched ? "border-danger " : "")+"form-control populate"} value={this.state.marks.value} disabled={this.state.disableAll} onBlur={(e) => { this.setMarksTouched(); this.validateMarks(e.target.value); }} onChange={(e) => this.validateMarks(e.target.value)} />
                                        {this.state.marks.error !== "" && this.state.marks.touched &&
                                            <span className="text-danger">{this.state.marks.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Video Link</label>
                                    <div className="col-lg-6">
                                        <input name="marks" type="text" className={(this.state.videoLink.error !== "" && this.state.videoLink.touched ? "border-danger " : "")+"form-control populate"} value={this.state.videoLink.value} disabled={this.state.disableAll} onBlur={(e) => { this.setVideoLinkTouched(); this.validateVideoLink(e.target.value); }} onChange={(e) => this.validateVideoLink(e.target.value)} />
                                        {this.state.videoLink.error !== "" && this.state.videoLink.touched &&
                                            <span className="text-danger">{this.state.videoLink.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className= "col-lg-3 control-label text-lg-end pt-2">Subject</label>
                                    <div className="col-lg-6">
                                        <select className= {(this.state.subject.error !== "" && this.state.subject.touched ? "border-danger " : "")+"form-control populate"} value={this.state.subject.value} disabled={this.state.disableAll} onBlur={(e) => { this.setSubjectTouched(); this.validateSubject(e.target.value); }} onChange={(e) => this.validateSubject(e.target.value)}>
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
                                        <select className={(this.state.topic.error !== "" && this.state.topic.touched ? "border-danger " : "")+"form-control populate"} value={this.state.topic.value} disabled={this.state.disableAll} onBlur={(e) => { this.setTopicTouched(); this.validateTopic(e.target.value); }} onChange={(e) => this.validateTopic(e.target.value)}>
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
                                        <select className="form-control populate" value={this.state.subTopic.value} onChange={(e) => this.setSubTopic(e.target.value)}>
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
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Complexity</label>
                                    <div className="col-lg-6">
                                        <select  className={(this.state.complexity.error !== "" && this.state.complexity.touched ? "border-danger " : "")+"form-control populate"} value={this.state.complexity.value} disabled={this.state.disableAll} onBlur={(e) => { this.setComplexityTouched(); this.validateComplexity(e.target.value); }} onChange={(e) => this.validateComplexity(e.target.value)}>
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
                                        <select className={(this.state.questionGroup.error !== "" && this.state.questionGroup.touched ? "border-danger " : "")+"form-control populate"} value={this.state.questionGroup.value} disabled={this.state.disableAll} onBlur={(e) => { this.setQuestionGroupTouched(); this.validateQuestionGroup(e.target.value); }} onChange={(e) => this.validateQuestionGroup(e.target.value)}>
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
                                                            onBlur={(e) => {this.setHintTouched(); this.validateHint(e.target.value);}} 
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
                                        <select className={(this.state.organization.error !== "" && this.state.organization.touched ? "border-danger " : "")+"form-control populate"} value={this.state.organization.value} disabled={this.state.disableAll} onBlur={(e) => { this.setOrganizationTouched(); this.validateOrganization(e.target.value); }} onChange={(e) => this.validateOrganization(e.target.value)}>
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
                                        <select className={(this.state.yearGroup.error !== "" && this.state.yearGroup.touched ? "border-danger " : "")+"form-control populate"} value={this.state.yearGroup.value} disabled={this.state.disableAll} onBlur={(e) => { this.setYearGroupTouched(); this.validateYearGroup(e.target.value); }} onChange={(e) => this.validateYearGroup(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getYearGroups()
                                            }
                                        </select>
                                        {this.state.yearGroup.error !== "" && this.state.yearGroup.touched &&
                                            <span className="text-danger">{this.state.yearGroup.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Question Type</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.questionType.error !== "" && this.state.questionType.touched ? "border-danger " : "")+"form-control populate"}value={this.state.questionType.value} disabled={this.state.disableAll} onBlur={(e) => { this.setQuestionTypeTouched(); this.validateQuestionType(e.target.value); }} onChange={(e) => this.validateQuestionType(e.target.value)}>
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
                                                            onBlur={(e) => {this.setMarkSchemeTouched(); this.validateMarkScheme(e.target.value);}} 
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
                                                            onBlur={(e) => {this.setSolutionTouched(); this.validateSolution(e.target.value);}} 
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
                                                            onBlur={(e) => {this.setQuestionReferencesTouched(); this.validateQuestionReferences(e.target.value);}} 
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
                                <div className="row my-3">
                                    <div className="col-4 mx-auto">
                                        <button className="btn btn-success w-100" disabled={this.state.loading} onClick={this.saveQuestion}>
                                            {this.state.loading &&
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											}
                                            Add Question
                                        </button>
                                    </div>
                                </div>           
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    onTagsUpdate = (tagsList, tag) => {
        let tags = tagsList;
        this.setState({ tags });
    }

    loadTags = async () => {
        try{
            const response = await this.tagService.getTags();
            let options = response.data.map(t => {
                return {id: t.id, name: t.tag1};
            });
            this.setState({ options: options });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load Tags.');
        }
    }

    seperateWords(words){
        return words.replace(/([a-z])([A-Z])/g, "$1 $2");
    }

    loadSubjects = async () => {
        try{
            const response = await this.sService.getSubjectsByUser();
            this.setState({ subjects: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load subjects.');
        }
    }

    loadTopics = async () => {
        try{
            const response = await this.tService.getTopics(this.state.subject.value);
            this.setState({ topics: response.data });
        }
        catch(error){
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
        try{
            const response = await this.oService.getOrganizations();
            this.setState({ organizations: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load organizations.');
        }
    }

    loadYearGroups = async () => {
        try{
            const response = await this.qService.getYearGroups();
            this.setState({ yearGroups: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load year groups.');
        }
    }

    loadQuestionTypes = async () => {
        try{
            const response = await this.qService.getQuestionTypes();
            this.setState({ questionTypes: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load question types.');
        }
    }

    loadQuestionGroups = async () => {
        try{
            const response = await this.qService.getQuestionGroups();
            this.setState({ questionGroups: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load question groups.');
        }
    }

    loadComplexities = async () => {
        try{
            const response = await this.qService.getComplexities();
            this.setState({ complexities: response.data });
        }
        catch(error){
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

    validateQuestionSave = () => {
        if(this.state.question.error !== '' || this.state.marks.error !== ''
        || this.state.complexity.error !== '' || this.state.organization.error !== ''
        || this.state.questionType.error !== '' || this.state.yearGroup.error !== '' || this.state.subject.error !== ''
        || this.state.topic.error !== '' || !this.state.question.touched || !this.state.marks.touched 
        || !this.state.complexity.touched || !this.state.organization.touched || !this.state.questionType.touched 
        || !this.state.yearGroup.touched 
        || !this.state.subject.touched || !this.state.topic.touched)
        {
            return false;
        }
        else{
            return true;
        }
    }

    saveQuestion = async () => {
        try{
            if(!this.validateQuestionSave()) return;
            this.setState({ loading: true });
            await this.qService.addQuestion({
                question: this.state.question.value,
                hint: this.state.hint.value,
                markScheme: this.state.markScheme.value,
                subject: this.state.subject.value,
                videoLink: this.state.videoLink.value,
                solution: this.state.solution.value,
                questionReferences: this.state.questionReferences.value,
                marks: this.state.marks.value,
                topic: this.state.subTopic.value === "" ? this.state.topic.value : this.state.subTopic.value,
                complexity: this.state.complexity.value,
                questionGroup: this.state.questionGroup.value,
                organization: this.state.organization.value,
                questionType: this.state.questionType.value,
                yearGroup: this.state.yearGroup.value,
                tags: this.state.tags,
            });
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Question has been added.');
            this.resetForm();
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            this.setState({ loading: false });
        }
    }

    //Validators
    validateQuestion = (value) => {
        let question = this.state.question;
        question.value = value;
        if(value !== ''){
            question.error = '';
            this.setState({ question });
        }
        else{
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
        if(value !== ''){
            hint.error = '';
            this.setState({ hint });
        }
        else{
            // hint.error = 'Hint is required.';
            this.setState({ hint });
        }
    }

    setHintTouched = () => {
        let hint = this.state.hint;
        hint.touched = true;
        this.setState({ hint });
    }

    validateMarkScheme = (value) => {
        let markScheme = this.state.markScheme;
        markScheme.value = value;
        if(value !== ''){
            markScheme.error = '';
            this.setState({ markScheme });
        }
        else{
            // markScheme.error = 'Mark Scheme is required.';
            this.setState({ markScheme });
        }
    }

    setMarkSchemeTouched = () => {
        let markScheme = this.state.markScheme;
        markScheme.touched = true;
        this.setState({ markScheme });
    }

    validateSolution = (value) => {
        let solution = this.state.solution;
        solution.value = value;
        if(value !== ''){
            solution.error = '';
            this.setState({ solution });
        }
        else{
            // solution.error = 'Solution is required.';
            this.setState({ solution });
        }
    }

    setSolutionTouched = () => {
        let solution = this.state.solution;
        solution.touched = true;
        this.setState({ solution });
    }

    validateQuestionReferences = (value) => {
        let questionReferences = this.state.questionReferences;
        questionReferences.value = value;
        if(value !== ''){
            questionReferences.error = '';
            this.setState({ questionReferences });
        }
        else{
            // questionReferences.error = 'Question References Scheme is required.';
            this.setState({ questionReferences });
        }
    }

    setQuestionReferencesTouched = () => {
        let questionReferences = this.state.questionReferences;
        questionReferences.touched = true;
        this.setState({ questionReferences });
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

    validateVideoLink = (value) => {   
        let videoLink = this.state.videoLink;
        videoLink.value = value;
        this.setState({ videoLink });

        // if (value === "") {
        //     videoLink.error = 'video Link is required.'
        //     this.setState({ videoLink });
        // }   
        // else {
        //     videoLink.error = '';
        //     this.setState({ videoLink });
        // }
    }

    setVideoLinkTouched = () => {
        let videoLink = this.state.videoLink;
        videoLink.touched = true;
        this.setState({ videoLink });
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
                this.loadTopics();
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
            yearGroup.error = 'Year Group is required.'
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
        this.setState({ questionGroup });
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
export default withRouter(AddQuestion);
