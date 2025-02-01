import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {

  ratingArr:number[] = [];
  private starCount: number = 10;

  constructor() { }

  ngOnInit(): void {
    for (let index:number = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

}
