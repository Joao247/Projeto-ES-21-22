import { ISOtoString } from '@/services/ConvertDateService';
import { QuestionAnswer } from '../management/QuestionAnswer';

export default class FailedAnswer {
  id!: number; 
  answered: string = 'No';
  collected!: string;
  questionAnswerDto!: QuestionAnswer;

  constructor(jsonObj?: FailedAnswer) {
    if (jsonObj) {
      this.id = jsonObj.id;
      if (jsonObj.answered){
        this.answered = 'Yes';
      }
      if (jsonObj.collected)
        this.collected = ISOtoString(jsonObj.collected);
      if (jsonObj.questionAnswerDto)
        this.questionAnswerDto = new QuestionAnswer(jsonObj.questionAnswerDto);
    }
  }
}