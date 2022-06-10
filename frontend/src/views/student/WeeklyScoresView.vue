<template>
  <v-container fluid>
    <v-card class="table">
      <h1>Weekly Scores
          <v-btn
            color="primary"
            dark
            v-on:click="updateWeeklyScores()"
            data-cy=refreshWeeklyScoreButton
            >Refresh <br />
          </v-btn>
      </h1>
      <v-data-table
        :headers="headers"
        :custom-filter="customFilter"
        :items="weeklyScores"
        :sort-by="['percentageCorrect']"
        sort-desc
        :mobile-breakpoint="0"
        :items-per-page="15"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom v-if="true">
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                v-on="on"
                data-cy=deleteWeeklyScoreButton
                @click="deleteWeeklyScore(item)"
                color="red"
                >delete</v-icon
              >
            </template>
            <span>Delete Weekly Score</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import WeeklyScore from '@/models/dashboard/WeeklyScore';
import RemoteServices from '@/services/RemoteServices';
import GlobalStatsView from '@/views/student/GlobalStatsView.vue';

@Component({
  components: {
    'weekly-score-view': WeeklyScoresView,
  },
})

export default class WeeklyScoresView extends Vue {
  @Prop({ type: Number, required: true })
  readonly dashboardId!: Number;
  weeklyScores: WeeklyScore[] = [];
  showQueryForm: boolean = true;
  headers: object = [
    {
      text: 'Actions',
      value: 'action',
      align: 'left',
      width: '5px',
      sortable: false,
    },
    {
      text: 'Week',
      value: 'week',
      width: '30%',
      align: 'center',
      sortable: false,
    },
    { 
      text: 'Number Answered', 
      value: 'numberAnswered', 
      width: '150px', 
      align: 'left' 
    },
    {
      text: 'Uniquely Answered',
      value: 'uniquelyAnswered',
      width: '150px',
      align: 'center',
    },
    {
      text: 'Percentage Correct',
      value: 'percentageCorrect',
      width: '150px',
      align: 'center',
    }
  ];

  async created() {
    await this.$store.dispatch('loading');
    await this.$store.dispatch('clearLoading');
    try {
        this.weeklyScores = await RemoteServices.getWeeklyScores(this.dashboardId.valueOf());
    }
    catch (error){
        await this.$store.dispatch('error', error);
    }
  }

  async updateWeeklyScores() {
  try {
      await RemoteServices.updateWeeklyScores(this.dashboardId.valueOf());
      this.weeklyScores = await RemoteServices.getWeeklyScores(this.dashboardId.valueOf());
  } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  async deleteWeeklyScore(toDeleteWeeklyScore: WeeklyScore) {
    try {
        await RemoteServices.deleteWeeklyScore(toDeleteWeeklyScore.id);
        this.weeklyScores = await RemoteServices.getWeeklyScores(this.dashboardId.valueOf());
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