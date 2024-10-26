import React, { Component } from "react"
import { NotificationService } from "../../general/services/Notification.service";
import { TagService } from "../services/TagsService";


class ManageTags extends Component {
    tagService = new TagService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            tagToEditId: '',
            tag: {
                value: '',
                touched: false,
                error:''
            },
            tagList: [],
        }
    }

    componentDidMount(){
        this.loadTags();
    }

    render(){
        return(
            <>
                <div className="col-md-11 col-xl-9 mx-auto">
                    <div className="accordion accordion-primary" id="accordion">
                        <div className="row p-5">
                            <div className="card card-default">
                                <div className="card-header">
                                    <h4 className="card-title m-0">
                                        <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                            Add Tag
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                    <div className="card-body">
                                        <div className="form-group row">
                                            <label className="col-lg-3 control-label text-lg-end mt-3">Tag Name</label>
                                            <div className="col-lg-5 mt-2">
                                                <input name="tag" type="text" className={(this.state.tag.error !== "" && this.state.tag.touched ? "border-danger " : "")+"form-control populate"} value={this.state.tag.value} disabled={this.state.loading} onBlur={(e) => { this.setTagTouched(); this.validateTag(e.target.value); }} onChange={(e) => this.validateTag(e.target.value)} />
                                                {this.state.tag.error !== "" && this.state.tag.touched &&
                                                    <span className="text-danger">{this.state.tag.error}</span>
                                                }
                                            </div>
                                            <div className="col-lg-4 mt-2">
                                                <button className="btn btn-success me-2" disabled={this.state.loading} onClick={this.addUpdateTag}>
                                                    {this.state.loading &&
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    }
                                                    {this.state.tagToEditId === '' ? 'Add' : 'Update'}
                                                </button>
                                                {this.state.tagToEditId !== '' && 
                                                    <button className="btn btn-warning" onClick={this.clearForm}>
                                                        Cancel
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                        <div className="row mt-5 mb-3 position-relative">
                                            <div className="col-lg-8 mx-auto">
                                                <ul className="list-group">
                                                    {
                                                        this.getTagsList()
                                                    }
                                                </ul>
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


    validateTag = (value) => {   
        let tag = this.state.tag;
        tag.value = value;
        if (value === "") {
            tag.error = 'Tag is required.'
            this.setState({ tag });
        }   
        else {
            tag.error = '';
            this.setState({ tag });
        }
    }

    setTagTouched = () => {
        let tag = this.state.tag;
        tag.touched = true;
        this.setState({ tag });
    }

    tagAdded = (tag) => {
        let tagList = this.state.tagList;
        tagList.unshift(tag);
        this.setState({ tagList });
    }

    tagUpdated = (index, tag) => {
        let tagList = this.state.tagList;
        tagList[index] = tag;
        this.setState({ tagList });
    }

    loadTags = async () => {
        try{
            const response = await this.tagService.getTags();
            const tagList = response.data;
            this.setState({ tagList });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', error.response.data);
        }
    }

    addUpdateTag = async () => {
        if(this.state.tag.value !== ""){
            try{
                this.setState({ loading: true });
                if(this.state.tagToEditId === ''){
                    const response = await this.tagService.addTag(this.state.tag.value);
                    this.tagAdded(response.data);
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Tag has been added.');
                }
                else{
                    const response = await this.tagService.editTag(this.state.tagToEditId, this.state.tag.value);
                    let index = this.state.tagList.findIndex(f => f.id === this.state.tagToEditId);
                    this.tagUpdated(index, response.data);
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Tag has been updated.');
                }
                this.clearForm();
            }
            catch(err){
                this.setState({ loading: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
        }
    }

    getTagsList = () => {
        let tags = [];
        this.state.tagList.forEach((tag, i) => {
            tags.push(
                <li className="list-group-item" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                        {tag.tag1}
                        <div className="">
                            <i className="fas fa-pencil-alt pointer text-primary fs-6 me-2" onClick={() => this.selectTagForEdit(tag.id, i)} />
                            <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.deleteTag(tag.id, i)}/>
                        </div>
                    </div>
                </li>
            );
        });
        return tags;
    }

    deleteTag = async (id, index) => {
        try{
            await this.tagService.deleteTag(id);
            this.tagDeleted(index);
            this.noti.sendNotification(this.noti.types.success, 'Success', "Tag has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    tagDeleted = (index) => {
        let tagList = this.state.tagList;
        tagList.splice(index, 1);
        this.setState({ tagList });
    }

    selectTagForEdit = (id, index) => {
        let tag = this.state.tag;
        tag.value = this.state.tagList[index].tag1;
        this.setState({ tagToEditId: id, tag }); 
    }

    clearForm = () => {
        let tag = {
            value: '',
            touched: false,
            error:''
        }
        this.setState({ tag, tagToEditId: '', loading: false });
    }
}
export default ManageTags;

