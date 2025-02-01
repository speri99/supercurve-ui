import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';


export interface TransactionInfo {
  accountNumber: string;
  transactionId: string;
  transactionAmount: number;
  sourcesymbol: string;
}

@Component({
  selector: 'app-reconcilation',
  templateUrl: './reconcilation.component.html',
  styleUrls: ['./reconcilation.component.css']
})
export class ReconcilationComponent implements OnInit {

  reconcilationData:any[]=[];
  files:any[]=[];
  displayedColumns: string[] = ['select', 'Account Number', 'Transaction Id', 'Transaction Amount','Source'];
  dataSource: MatTableDataSource<TransactionInfo>[]=[];
  selection = new SelectionModel<TransactionInfo>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    // if (this.isAllSelected()) {
    //   this.selection.clear();
    //   return;
    // }

    // this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TransactionInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.transactionId + 1}`;
  }
  constructor(private appService:MainService){

  }

  ngOnInit(): void {
  }


  onFileAdd(files:any|null) {
    const file:File |null= files.files.item(0);
    this.files.push(file);
    //console.log(file, this.files);
  }

  getReconcilationData(){
    this.appService.getReconcilationReport(this.files).subscribe((data:any)=>{
      console.log(data)
      this.reconcilationData=data;
      this.dataSource=[...data];
    },(err)=>{
      console.log(err);
    })
    
  }

  generatePdf(){
    let doc=new jsPDF();
    doc.text("Reconcilation Report",80,15);
    autoTable(doc,{theme:'grid',
      startY:18,
      body:this.reconcilationData,
      columns:[
        {
          header:"Account Number",
          dataKey:"accountNumber"
        },
        {
          header:"Transaction Id",
          dataKey:"transactionId"
        },
        {
          header:"Transaction Amount",
          dataKey:"transactionAmount"
        }
      ]
  
  },)

   
    doc.output('dataurlnewwindow');
  }

}
