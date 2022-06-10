<template>
  <v-container fluid>
    <v-card class="table">
      <v-data-table
        :headers="headers"
        :items="difficultQuestions"
        :sort-by="['percentage']"
        :sort-desc="false"
        :mobile-breakpoint="0"
        :items-per-page="10"
        :footer-props="{ itemsPerPageOptions: [10, 20, 30, 40] }"
      >
        <template v-slot:top>
          <v-card-title>
            <h1>Difficult Questions</h1>
            <v-spacer />
            <v-btn
              color="primary"
              dark
              data-cy="refreshDifficultQuestionsButton"
              @click="refreshDifficultQuestions"
              >REFRESH</v-btn
            >
          </v-card-title>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                v-on="on"
                @click="showStudentViewDialog(item.question)"
                >school</v-icon
              >
            </template>
            <span>Student View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                v-on="on"
                data-cy="deleteDifficultQuestionButton"
                @click="deleteDifficultQuestion(item)"
                color="red"
                >delete</v-icon
              >
            </template>
            <span>Remove Difficult Question</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.question`]="{ item }">
          <span> {{ item.question.title }} </span>
        </template>
        <template v-slot:[`item.percentage`]="{ item }">
          <v-chip small>
            <span> {{ item.percentage }} </span>
          </v-chip>
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
import RemoteServices from '@/services/RemoteServices';
import DifficultQuestion from '@/models/dashboard/DifficultQuestion';
import Question from '@/models/management/Question';
import StatementQuestion from '@/models/statement/StatementQuestion';
import StudentViewDialog from '@/views/teacher/questions/StudentViewDialog.vue';

@Component({
  components: {
    'student-view-dialog': StudentViewDialog,
  },
})
export default class DifficultQuestionsView extends Vue {
  @Prop({ type: Number, required: true }) dashboardId!: Number;
  difficultQuestions: DifficultQuestion[] = [];
  studentViewDialog: boolean = false;
  statementQuestion: StatementQuestion | null = null;

  headers: object = [
    {
      text: 'Actions',
      value: 'actions',
      width: '5px',
      align: 'center',
      sortable: false,
    },
    {
      text: 'Question',
      value: 'question',
      width: '80%',
      align: 'left',
      sortable: false,
    },
    {
      text: 'Percentage',
      value: 'percentage',
      width: '10%',
      align: 'center',
    },
  ];

  async created() {
    await this.$store.dispatch('loading');
    await this.getDifficultQuestions();
    await this.$store.dispatch('clearLoading');
  }

  async getDifficultQuestions() {
    try {
      this.difficultQuestions = await RemoteServices.getDifficultQuestions(
        this.dashboardId.valueOf()
      );
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  async refreshDifficultQuestions() {
    try {
      await RemoteServices.updateDifficultQuestions(this.dashboardId.valueOf());
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.getDifficultQuestions();
  }

  async deleteDifficultQuestion(toDeleteDifficultQuestion: DifficultQuestion) {
    try {
      await RemoteServices.deleteDifficultQuestion(
        toDeleteDifficultQuestion.id
      );
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.getDifficultQuestions();
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

  onCloseStudentViewDialog() {
    this.statementQuestion = null;
    this.studentViewDialog = false;
  }
}
</script>
