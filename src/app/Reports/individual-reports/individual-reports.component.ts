import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { ViewEncapsulation } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-individual-reports',
  templateUrl: './individual-reports.component.html',
  styleUrls: ['./individual-reports.component.scss']
})
export class IndividualReportsComponent implements OnInit {

  individualForm: FormGroup;
  temp = [];
  rows = [];
  clientType: any;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];
  docType: any;
  openTab: boolean = true;
  isLoading: boolean;
  hideDocumentValue: boolean = false;
  hidePaymentValue: boolean = false;

  columns = [
    { name: 'First Name', props: 'first_name', minWidth: 0 },
    { name: 'Last Name', props: 'last_name', minWidth: 0 },
    { name: 'DOB', props: 'DOB', minWidth: 0 },
    { name: 'Gender', props: 'sex', minWidth: 0 },
    { name: 'Phone', props: 'phone', minWidth: 0 },
    { name: 'Email', props: 'email', minWidth: 230 },
    { name: 'Zip', props: 'zip', minWidth: 0 },
    { name: 'City', props: 'city', minWidth: 0 },
    { name: 'Client Type', props: 'client_type', minWidth: 0 },
  ];

  allColumns = [
    { name: 'First Name', props: 'first_name', minWidth: 0 },
    { name: 'Last Name', props: 'last_name', minWidth: 0 },
    { name: 'DOB', props: 'DOB', minWidth: 0 },
    { name: 'Gender', props: 'sex', minWidth: 0 },
    { name: 'Phone', props: 'phone', minWidth: 0 },
    { name: 'Email', props: 'email', minWidth: 230 },
    { name: 'Zip', props: 'zip', minWidth: 0 },
    { name: 'City', props: 'city', minWidth: 0 },
    { name: 'Client Type', props: 'client_type', minWidth: 0 },];

  ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent, { static: true }) myFilterTable: DatatableComponent;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;

  constructor(private elementRef: ElementRef, private fb: FormBuilder, private spinner: NgxSpinnerService, private api: ApiService) { }

  ngOnInit() {
    this.clientType = JSON.parse(localStorage.getItem('constants')).clientType;
    this.docType = JSON.parse(localStorage.getItem('docType'));
    for (let i = (this.currentYear - 15); i < (this.currentYear + 15); i++) {
      this.years.push(i);
    }
    this.buildIndividualForm();
  }

  buildIndividualForm(): void {

    this.individualForm = new FormGroup({
      "first_name": new FormControl('',),
      "last_name": new FormControl('',),
      "birth_date_from": new FormControl('',),
      "birth_date_to": new FormControl('',),
      "city": new FormControl('',),
      "zip_code": new FormControl('',),
      "client_type": new FormControl('',),
      "payment_expiry_month_from": new FormControl('',),
      "payment_expiry_month_to": new FormControl('',),
      "payment_expiry_year_from": new FormControl('',),
      "payment_expiry_year_to": new FormControl('',),
      "document_status": new FormControl('',),
      "document_type_id":new FormControl(''),
      "document_due_date_from": new FormControl('',),
      "document_due_date_to": new FormControl('',),
    });
  }


  hideDocument(form: FormGroup) {
    form.controls['status'].disable();
    form.controls['document_due_date_from'].disable();
    form.controls['document_due_date_to'].disable();
    this.hideDocumentValue = true;
    this.allColumns = [
      { name: 'First Name', props: 'first_name', minWidth: 0 },
      { name: 'Last Name', props: 'last_name', minWidth: 0 },
      { name: 'DOB', props: 'DOB', minWidth: 0 },
      { name: 'Gender', props: 'sex', minWidth: 0 },
      { name: 'Phone', props: 'phone', minWidth: 0 },
      { name: 'Email', props: 'email', minWidth: 230 },
      { name: 'Zip', props: 'zip', minWidth: 0 },
      { name: 'City', props: 'city', minWidth: 0 },
      { name: 'Client Type', props: 'client_type', minWidth: 0 },
      { ...(!this.hidePaymentValue && { name: 'Type', props: 'payment_type', minWidth: 0 }) },
      { ...(!this.hidePaymentValue && { name: 'Acct#', props: 'account_number', minWidth: 230 }) },
      { ...(!this.hidePaymentValue && { name: 'Expiry M/Y', props: 'expiry', minWidth: 0 }) },
      // { ...(!this.hidePaymentValue && { name: 'Expiry Year', props: 'expiry_year', minWidth: 0 }) },

      { ...(!this.hideDocumentValue && { name: 'Type', props: 'document_type_id', minWidth: 0 }) },
      { ...(!this.hideDocumentValue && { name: 'Status', props: 'status', minWidth: 0 }) },
      { ...(!this.hideDocumentValue && { name: 'Submitted', props: 'date_submitted', minWidth: 0 }) },
      { ...(!this.hideDocumentValue && { name: 'Due Date', props: 'due_date', minWidth: 0 }) },
    ];
    this.columns = [
      { name: 'First Name', props: 'first_name', minWidth: 0 },
      { name: 'Last Name', props: 'last_name', minWidth: 0 },
      { name: 'DOB', props: 'DOB', minWidth: 0 },
      { name: 'Gender', props: 'sex', minWidth: 0 },
      { name: 'Phone', props: 'phone', minWidth: 0 },
      { name: 'Email', props: 'email', minWidth: 230 },
      { name: 'Zip', props: 'zip', minWidth: 0 },
      { name: 'City', props: 'city', minWidth: 0 },
      { name: 'Client Type', props: 'client_type', minWidth: 0 },];

    this.allColumns = this.allColumns.filter(value => JSON.stringify(value) !== '{}');
  }

  hidePayment(form: FormGroup) {
    form.controls['payment_expiry_month_from'].disable();
    form.controls['payment_expiry_month_to'].disable();
    form.controls['payment_expiry_year_from'].disable();
    form.controls['payment_expiry_year_to'].disable();
    this.hidePaymentValue = true;
    this.allColumns = [
      { name: 'First Name', props: 'first_name', minWidth: 0 },
      { name: 'Last Name', props: 'last_name', minWidth: 0 },
      { name: 'DOB', props: 'DOB', minWidth: 0 },
      { name: 'Gender', props: 'sex', minWidth: 0 },
      { name: 'Phone', props: 'phone', minWidth: 0 },
      { name: 'Email', props: 'email', minWidth: 230 },
      { name: 'Zip', props: 'zip', minWidth: 0 },
      { name: 'City', props: 'city', minWidth: 0 },
      { name: 'Client Type', props: 'client_type', minWidth: 0 },
      { ...(!this.hidePaymentValue && { name: 'Type', props: 'payment_type', minWidth: 0 }) },
      { ...(!this.hidePaymentValue && { name: 'Acct#', props: 'account_number', minWidth: 230 }) },
      { ...(!this.hidePaymentValue && { name: 'Expiry M/Y', props: 'expiry', minWidth: 0 }) },

      { ...(!this.hideDocumentValue && { name: 'Type', props: 'document_type_id', minWidth: 0 }) },
      { ...(!this.hideDocumentValue && { name: 'Status', props: 'status', minWidth: 0 }) },
      { ...(!this.hideDocumentValue && { name: 'Submitted', props: 'date_submitted', minWidth: 0 }) },
      { ...(!this.hideDocumentValue && { name: 'Due Date', props: 'due_date', minWidth: 0 }) },
    ];
    this.columns = [
      { name: 'First Name', props: 'first_name', minWidth: 0 },
      { name: 'Last Name', props: 'last_name', minWidth: 0 },
      { name: 'DOB', props: 'DOB', minWidth: 0 },
      { name: 'Gender', props: 'sex', minWidth: 0 },
      { name: 'Phone', props: 'phone', minWidth: 0 },
      { name: 'Email', props: 'email', minWidth: 230 },
      { name: 'Zip', props: 'zip', minWidth: 0 },
      { name: 'City', props: 'city', minWidth: 0 },
      { name: 'Client Type', props: 'client_type', minWidth: 0 },
    ];
    this.allColumns = this.allColumns.filter(value => JSON.stringify(value) !== '{}');
  }

  adjustColumnMinWidth() {
    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName("datatable-body-row");
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("datatable-body-cell");
      for (let k = 0; k < cells.length; k++) {
        const cell = cells[k];
        const cellSizer = cell.children[0].children[0] as HTMLElement;
        const sizerWidth = cellSizer.getBoundingClientRect().width;
        if (this.columns[k].minWidth < sizerWidth) {
          this.columns[k].minWidth = sizerWidth;
        }
      }
    }
  }

  resetReportForm() {
    this.individualForm.reset();
    this.hideDocumentValue = false;
    this.hidePaymentValue = false;
    this.individualForm.controls['payment_expiry_year_from'].enable();
    this.individualForm.controls['payment_expiry_year_to'].enable();
    this.individualForm.controls['payment_expiry_month_from'].enable();
    this.individualForm.controls['payment_expiry_month_to'].enable();
    this.individualForm.controls['status'].enable();
    this.individualForm.controls['document_due_date_from'].enable();
    this.individualForm.controls['document_due_date_to'].enable();
  }

  toggle(col) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns = [...this.columns, col];
    }
  }

  isChecked(col) {
    return (
      this.columns.find(c => {
        return c.name === col.name;
      }) !== undefined
    );
  }

  onSubmit(form: FormGroup) {
    // this.spinner.show();
    this.isLoading = true;
    this.openTab = false;
    this.api.searchClientDetaials(form.value).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.temp = [...data.result];
        this.rows = data.result;
        this.spinner.hide();
        this.isLoading = false;
      } else {
        this.spinner.hide();
      }
    });
  }


  updateFilter(event) {
    const val = event.target.value.toString().toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.first_name && d.first_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.last_name && d.last_name.toString().toLowerCase().indexOf(val) !== -1 ||
        d.sex && d.sex.toString().toLowerCase().indexOf(val) !== -1 ||
        d.phone && d.phone.toString().toLowerCase().indexOf(val) !== -1 ||
        d.email && d.email.toString().toLowerCase().indexOf(val) !== -1 ||
        d.zip && d.zip.toString().toLowerCase().indexOf(val) !== -1 ||
        d.city && d.city.toString().toLowerCase().indexOf(val) !== -1 ||
        d.client_type && d.client_type.toString().toLowerCase().indexOf(val) !== -1 ||
        d.DOB && d.DOB.toString().toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.myFilterTable.offset = 0;
  }

  ExportToExcle() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Individual Report',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(this.rows);
  }

}
