<template>
  <v-container fluid>
    <v-card class="table">
      <h1>Failed Answers
          <v-btn
            color="primary"
            dark
            v-on:click="updateFailedAnswers()"
            data-cy=RefreshFailedAnswerButton
            >Refresh <br />
          </v-btn>
      </h1>
      <v-data-table
        :headers="headers"
        :custom-filter="customFilter"
        :items="failedAnswers"
        :sort-by="['collected']"
        sort-desc
        :mobile-breakpoint="0"
        :items-per-page="15"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                v-on="on"
                @click="showStudentViewDialog(item.questionAnswerDto.question)"
                >school</v-icon
              >
            </template>
            <span>Student View</span>
          </v-tooltip>
          <v-tooltip bottom v-if="true">
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                v-on="on"
                data-cy=deleteFailedAnswerButton
                @click="deleteFailedAnswer(item)"
                color="red"
                >delete</v-icon
              >
            </template>
            <span>Delete Failed Answer</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <student-view-dialog
        v-if="statementQuestion && studentViewDialog"
        v-model="studentViewDialog"
        :statementQuestion="statementQuestion"
        v-on:close-show-question-dialog="onCloseStudentViewDialog"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import FailedAnswer from '@/models/dashboard/FailedAnswer';
import RemoteServices from '@/services/RemoteServices';
import StudentViewDialog from '@/views/teacher/questions/StudentViewDialog.vue';
import Question from '@/models/management/Question';
import StatementQuestion from '@/models/statement/StatementQuestion';

@Component({
  components: {'student-view-dialog': StudentViewDialog},
})
export default class FailedAnswersView extends Vue {
  @Prop({ type: Number, required: true })
  readonly dashboardId!: Number;

  failedAnswers: FailedAnswer[] = [];
  studentViewDialog: boolean = false;
  showQueryForm: boolean = true;
  statementQuestion: StatementQuestion | null = null;

  headers: object = [
    {
      text: 'Actions',
      value: 'action',
      align: 'left',
      width: '5px',
      sortable: false,
    },
    {
      text: 'Question',
      value: 'questionAnswerDto.question.content',
      width: '30%',
      align: 'center',
      sortable: false,
    },
    { 
        text: 'Answered', 
        value: 'answered', 
        width: '150px', 
        align: 'left' 
    },
    {
      text: 'Collected',
      value: 'collected',
      width: '150px',
      align: 'center',
    },
  ];

  async created() {
    await this.$store.dispatch('loading');
   
    await this.$store.dispatch('clearLoading');
  }

  async showStudentViewDialog(question: Question) {
    if (question.id) {
      try {
        this.statementQuestion = await RemoteServices.getStatementQuestion(
          question.id
        );
        this.studentViewDialog = true;
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }

  async deleteFailedAnswer(toDeleteFailedAnswer: FailedAnswer) {
      try {
        await RemoteServices.deleteFailedAnswer(toDeleteFailedAnswer.id);
        this.failedAnswers = await RemoteServices.getFailedAnswers(this.dashboardId.valueOf());
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
  }

  async updateFailedAnswers() {
      try {
          await RemoteServices.updateFailedAnswers(this.dashboardId.valueOf());
          this.failedAnswers = await RemoteServices.getFailedAnswers(this.dashboardId.valueOf());
      } catch (error) {
          await this.$store.dispatch('error', error);
      }
  }
}
</script>

<style lang="scss" scoped>
.question-textarea {
  text-align: left;

  .CodeMirror,
  .CodeMirror-scroll {
    min-height: 200px !important;
  }
}
.option-textarea {
  text-align: left;

  .CodeMirror,
  .CodeMirror-scroll {
    min-height: 100px !important;
  }
}

h1 {
    text-align: left;
}
</style>