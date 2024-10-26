import './App.css';
import 'katex/dist/katex.min.css';
import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './modules/auth/components/login/Login';
import Register from './modules/auth/components/register/Register';
import { Layout } from './modules/layouts/components/Layout';
import AddQuestion from './modules/questions/components/add-question/AddQuestion';
import ManageSubjects from './modules/subjects/components/manage-subjects/ManageSubjects';
import ManageTopics from './modules/topics/components/ManageTopics';
import ManageQuestionTypes from './modules/question-type/components/ManageQuestionTypes';
import ManageComplexity from './modules/complexity/components/ManageComplexity';
import ManageOrganizations from './modules/organization/components/ManageOrganizations';
import QuestionList from './modules/questions/components/question-list/QuestionList';
import EditQuestion from './modules/questions/components/edit-question/EditQuestion';
import AddQuestionGroup from './modules/question-group/components/add-question-group/AddQuestionGroup';
import EditQuestionGroup from './modules/question-group/components/edit-question-group/EditQuestionGroup';
import QuestionGroupList from './modules/question-group/components/question-group-list/QuestionGroupList';
import QuestionsListForApproval from './modules/questions/components/questions-list-for-approval/QuestionsListForApproval';
import QuestionApprovalDetail from './modules/questions/components/question-approval-detail/QuestionApprovalDetail';
import ManageTags from './modules/tags/components/ManageTags';
import ManagePaperType from './modules/paper-type/components/ManagePaperType';
import AddPaper from './modules/papers/components/add-paper/AddPaper';
import EditPaper from './modules/papers/components/edit-paper/EditPaper';
import PaperList from './modules/papers/components/paper-list/PaperList';

class App extends Component {
  render (){
    return(
        <>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
              <Route path='/dashboard' element={<Layout />}>
                <Route path='/dashboard/register' element={<Register />} />
                <Route path='/dashboard/add-question' element={<AddQuestion />} />
                <Route path='/dashboard/add-question/:id' element={<AddQuestion />} />
                <Route path='/dashboard/subjects' element={<ManageSubjects />} />
                <Route path='/dashboard/topics' element={<ManageTopics />} />
                <Route path='/dashboard/question-type' element={<ManageQuestionTypes />} />
                <Route path='/dashboard/complexity' element={<ManageComplexity />} />
                <Route path='/dashboard/organizations' element={<ManageOrganizations />} />
                <Route path='/dashboard/questions-list' element={<QuestionList />} />
                <Route path='/dashboard/edit-question/:id' element={<EditQuestion />} />
                <Route path='/dashboard/question-group' element={<AddQuestionGroup/>} />
                <Route path='/dashboard/edit-question-group/:id' element={<EditQuestionGroup/>} />
                <Route path='/dashboard/question-groups-list' element={<QuestionGroupList/>} />
                <Route path='/dashboard/questions-list-for-approval' element={<QuestionsListForApproval/>} />
                <Route path='/dashboard/question-approval-detail/:id' element={<QuestionApprovalDetail/>} />
                <Route path='/dashboard/tags/' element={<ManageTags/>} />
                <Route path='/dashboard/paper-type/' element={<ManagePaperType/>} />
                <Route path='/dashboard/add-paper/' element={<AddPaper/>} />
                <Route path='/dashboard/edit-paper/:id' element={<EditPaper/>} />
                <Route path='/dashboard/paper-list/' element={<PaperList/>} />
              </Route>             
            </Routes>
          </BrowserRouter>
        </>
    )
  };
}

axios.interceptors.request.use(
  (req) => {
      if (req.headers) {
          if (localStorage.getItem('ASPNetAuthToken') && localStorage.getItem('ASPNetAuthToken') !== "") {
              let accessToken = JSON.parse(localStorage.getItem('ASPNetAuthToken'));
              req.headers.Authorization = `Bearer ${accessToken.token}`;
          }
          return req;
      }
  }
  ,
  (err) => {
      return err;
  }
);

export default App;
