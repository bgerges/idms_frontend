import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { IndividualDetailServiceService } from '../individual-detail-service.service';
import { ApiService } from '../services/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { element } from 'protractor';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {

  attachmentForm: FormGroup;
  control: FormArray;
  mode: boolean;
  docType: any;
  modalMessage: any;
  modalRef: BsModalRef;
  touchedRows: any;
  fileArray: any = [];
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder, private modalService: BsModalService, private api: ApiService, private saveIndividuals: IndividualDetailServiceService) { }

  ngOnInit(): void {
    this.getConstants();
    this.touchedRows = [];
    this.attachmentForm = this.fb.group({
      clientAttachmentDetails: this.fb.array([])
    });
    if (localStorage.getItem('ClientDetails')) {
      if (JSON.parse(localStorage.getItem('ClientDetails')).clientAttachmentDetails.length >= 1) {
        this.setDetails();
      } else {
        this.addRow();
      }
    } else {
      this.addRow();
    }
  }

  ngAfterOnInit() {
    this.control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      attachment_type: ['', Validators.required],
      attachment_location: ['', Validators.required],
      attachment_description: [''],
      isEditable: [true]
    });
  }

  setDetails() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    const Details = JSON.parse(localStorage.getItem('ClientDetails')).clientAttachmentDetails;
    Details.map(element => {
      console.log(element);

      delete element.client_id;
      control.push(this.setForm(element));
    });
    //this.deleteRow(0);
    this.saveIndividuals.addToIndividual(this.attachmentForm.value);

  }

  setForm(element): FormGroup {
    return this.fb.group({
      attachment_type: [element.attachment_type, Validators.required],
      attachment_location: [element.attachment_location, Validators.required],
      attachment_description: [element.attachment_description],
      isEditable: [true]
    });
  }

  getConstants() {
    this.docType = JSON.parse(localStorage.getItem('docType'));
  }

  addRow() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    return control;
  }


  uploadFile(file, index) {
    const File = <File>file[0];
    const formData = new FormData();
    formData.append('file', File, File.name);
    formData.append('userId', localStorage.getItem('userId'));

    this.api.uploadAttachment(formData).subscribe((data: any) => {
      this.openModal();
      if (data.responseCode === 200) {
        this.spinner.hide();
        this.fileArray[index] = data.result.fileName;
        this.modalMessage = data.message;
        return this.modalRef = this.modalService.show(this.templateRef);
      } else {
        this.spinner.hide();
        this.modalMessage = data.error;
        return this.modalRef = this.modalService.show(this.templateRef);
      }
    });
    this.submitForm();
  }

  openModal(): any {
    this.spinner.show();
  }

  submitForm() {
    const control = this.attachmentForm.get('clientAttachmentDetails') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (!this.attachmentForm.valid) {

      // setTimeout(() => {
      //   this.modalMessage = "Please Fill All Details Correctly!!"
      //   return this.modalRef = this.modalService.show(this.templateRef);
      // }, 5000);

    } else {
      var contactsDetails = this.attachmentForm.value.clientAttachmentDetails;
      contactsDetails.forEach((element, key) => {
        delete element.isEditable;
        delete element.attachment_location;
        const id = key + 1;
        element.attachment_description = element.attachment_description.toString();
        element.attachment_id = id.toString();
        const fileName = this.fileArray[key];
        element.attachment_location = fileName;

      });
      console.log(this.saveIndividuals.addToIndividual(this.attachmentForm.value));
    }
  }

}
