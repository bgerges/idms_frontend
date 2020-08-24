import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Constants } from '../configuration/constants';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as cities from 'list-of-us-cities';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-individual',
  templateUrl: './new-individual.component.html',
  styleUrls: ['./new-individual.component.scss']
})
export class NewIndividualComponent implements OnInit {

  @ViewChild('mediumModalContent', { static: true }) modal: TemplateRef<any>;

  clientType: any;
  contactype: any;
  addresstype: any;
  paymentType: any;
  docType: any;
  incomeFrequency: any;

  showContacts: boolean = false;
  showPayment: boolean = false;
  showRelations: boolean = false;
  showAttachment: boolean = false;
  showEmployemment: boolean = false;
  showAddress: boolean = false;

  FormError: string;
  hideSubmit: boolean = false;
  modalMessage: string = "Do you want to save details?";
  confirmModal: boolean = true;
  successModal: boolean = false;

  contactError: Boolean = false;
  contactFormError: string;
  contactMessage: string;
  contactSuccess: boolean = false;
  contactForm: FormGroup;
  contactsArray: any = [];

  successMessage: string;
  success: boolean = false;
  individualForm: FormGroup;
  firstName: string;
  middleName: string;
  lastName: string;
  DOB: string;
  sex: string;
  ssn: string;
  weight: string;
  feet: string;
  inches: string;
  mpUserId: string;
  mpPassword: string;
  driverState: string;
  driverNumber: string;
  clienttype: string
  notes: string;

  addressForm: FormGroup;
  addressError: Boolean = false;
  addressFormError: string;
  addressMessage: string;
  addressSuccess: boolean = false;
  addressArray: any = [];

  employerForm: FormGroup;
  employerError: Boolean = false;
  employerFormError: string;
  employerMessage: string;
  employerSuccess: boolean = false;
  employerArray: any = [];

  paymentForm: FormGroup;
  paymentError: Boolean = false;
  paymentFormError: string;
  paymentMessage: string;
  paymentSuccess: boolean = false;
  paymentArray: any = [];

  documentForm: FormGroup;
  documentError: Boolean = false;
  documentFormError: string;
  documentMessage: string;
  documentSuccess: boolean = false;
  documnetArray: any = [];
  selectedFile: File = null;

  states: any;
  city: any;
  cancelButton: boolean = false;
  year = new Date().getFullYear();
  range = [];


  constructor(private spinner: NgxSpinnerService, private modalService: NgbModal, private fb: FormBuilder, private api: ApiService, public Router: Router, public States: Constants) {
    this.states = States.stateValue;
    this.getConstants();
  }

  ngOnInit() {
    this.buildIndividualForm();
    this.city = cities;

    for (var i = 0; i < 25; i++) {
      this.range.push(this.year + i,);
    }

  }

  redirect() {
    this.Router.navigate(['/individuals']);
  }

  cancel() {
    this.modalMessage = 'Your details will not be saved if Cancelled!!';
    this.successModal = true;
    this.confirmModal = false;
    return this.modalService.open(this.modal);
  }


  openMediumModal(mediumModalContent) {
    this.modalService.open(mediumModalContent);
  }

  buildIndividualForm(): void {
    this.individualForm = new FormGroup({
      "first_name": new FormControl('', [
        Validators.required
      ]),
      "middle_name": new FormControl('', [
      ]),
      "last_name": new FormControl('', [
        Validators.required
      ]),
      "DOB": new FormControl('', [
        Validators.required
      ]),
      "sex": new FormControl('', [
        Validators.required
      ]),
      "ssn": new FormControl('', [
        Validators.required
      ]),
      "height_inches": new FormControl('', [
        Validators.required
      ]),
      "height_feet": new FormControl('', [
        Validators.required
      ]),
      "weight": new FormControl('', [
        Validators.required
      ]),
      "mp_user_id": new FormControl('', [
        Validators.required
      ]),
      "mp_password": new FormControl('', [
        Validators.required
      ]),
      "driver_license_state": new FormControl('', [
        Validators.required
      ]),
      "driver_license_number": new FormControl('', [
        Validators.required
      ]),
      "client_type": new FormControl('', [
        Validators.required
      ]),
      "notes": new FormControl('', [
        Validators.required
      ]),
    });

    const getClientDetail = JSON.parse(localStorage.getItem('ClientDetails'));

    if (getClientDetail) {
      const Client = getClientDetail.clientDetails[0];
      this.firstName = Client.first_name;
      this.middleName = Client.middle_name;
      this.lastName = Client.last_name;
      this.DOB = Client.DOB;
      this.sex = Client.sex;
      this.ssn = Client.ssn;
      this.weight = Client.weight;
      this.feet = Client.height_feet;
      this.inches = Client.height_inches;
      this.mpUserId = Client.mp_user_id;
      this.mpPassword = Client.mp_password;
      this.driverState = Client.driver_license_state;
      this.driverNumber = Client.driver_license_number;
      this.clienttype = Client.client_type;
      this.notes = Client.notes;
      this.hideSubmit = true;

      //contacts
      const Contacts = getClientDetail.clientContactDetails;
      if (Contacts.length > 0) {
        const ContactType = JSON.parse(localStorage.getItem('constants')).contactType;
        this.showContacts = true;
        Contacts.map(element => {
          this.contactsArray.push({
            phone: element.phone,
            email: element.email,
            contact_type: ContactType[element.contact_type],
          })
        })
      }

      const Address = getClientDetail.clientAddressDetails;
      if (Address.length > 0) {
        const ContactType = JSON.parse(localStorage.getItem('constants')).addressType;
        this.showAddress = true;
        Address.map(element => {
          this.addressArray.push({
            number: element.number,
            street: element.street,
            suite: element.suite,
            city: element.city,
            state: element.state,
            zip: element.zip,
            address_type: ContactType[element.address_type],
            from_date: element.from_date,
            to_date: element.to_date
          })
        })
      }

      const Employer = getClientDetail.clientEmploymentDetails;
      if (Employer) {
        this.showEmployemment = true;
        const Frequency = JSON.parse(localStorage.getItem('constants')).incomeFrequency;
        Employer.map(element => {
          this.employerArray.push({
            employer_name: element.employer_name,
            employer_phone: element.employer_phone,
            income_amount: element.income_amount,
            income_frequency: Frequency[element.income_frequency],
            start_date: element.start_date,
            end_date: element.end_date
          })
        })
      }

      const Payment = getClientDetail.clientPaymentMethods;

      if (Payment.length > 0) {
        this.showPayment = true;
        const PaymentType = JSON.parse(localStorage.getItem('constants')).paymentType;
        Payment.map(element => {
          this.paymentArray.push({
            payment_type: PaymentType[element.payment_type],
            account_number: element.account_number,
            account_name: element.account_name,
            routing_number: element.routing_number,
            cvv: element.cvv,
            expiry_month: element.expiry_month,
            expiry_year: element.expiry_year,
            valid: element.valid,
          })
        })
      }

      const Document = getClientDetail.clientDocumentDetails;
      if (Document.length > 0) {
        const docType = JSON.parse(localStorage.getItem('docType'));
        this.showAttachment = true;
        Document.map(element => {
          this.documnetArray.push({
            document_type_id: docType.map(item => {
              if (element.document_type_id == item.document_type_id) {
                return item.doc_type_description
              }
            }),
            due_date: element.due_date,
            date_submitted: element.date_submitted,
            status: element.status,
          })
        })

      }
    }


    this.contactForm = this.fb.group({
      contacts: this.fb.array([this.fb.group({
        phone: '',
        email: '',
        contact_type: '',
      }
      )])
    });

    this.addressForm = this.fb.group({
      address: this.fb.array([this.fb.group({
        number: "",
        street: "",
        suite: "",
        city: "",
        state: "",
        zip: "",
        address_type: "",
        from_date: "",
        to_date: ""
      })])
    });

    this.employerForm = this.fb.group({
      employer: this.fb.array([this.fb.group({
        employer_name: "",
        employer_phone: "",
        income_amount: "",
        income_frequency: "",
        start_date: "",
        end_date: ""
      })])
    });

    this.paymentForm = this.fb.group({
      payment: this.fb.array([this.fb.group({
        payment_type: "",
        account_number: "",
        account_name: "",
        routing_number: "",
        cvv: "",
        expiry_month: "",
        expiry_year: "",
        valid: "",
      })])
    });

    this.documentForm = this.fb.group({
      document: this.fb.array([this.fb.group({
        attachment_type: "",
        attachment_description: "",
        attachment_location: "",
      })])
    });

    this.setViewDetails();
  }

  setViewDetails() {
    //setting for edit profile
    if (localStorage.getItem('ClientDetails')) {

      const ContactsDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientContactDetails;

      ContactsDetails.map(element => {
        this.contacts.push(this.fb.group({
          phone: element.phone,
          email: element.email,
          contact_type: element.contact_type,
        }));
      });
      this.contacts.removeAt(0);


      const AddressDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientAddressDetails;

      AddressDetails.map(element => {
        this.address.push(this.fb.group({
          number: element.number,
          street: element.street,
          suite: element.suite,
          city: element.city,
          state: element.state,
          zip: element.zip,
          address_type: element.address_type,
          from_date: element.from_date,
          to_date: element.to_date
        }));
      });
      this.address.removeAt(0);

      const EnployerDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientEmploymentDetails;

      EnployerDetails.map(element => {
        this.employer.push(this.fb.group({
          employer_name: element.employer_name,
          employer_phone: element.employer_phone,
          income_amount: element.income_amount,
          income_frequency: element.income_frequency,
          start_date: element.start_date,
          end_date: element.end_date
        }));
      });
      this.employer.removeAt(0);

      const PaymentDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientPaymentMethods;

      PaymentDetails.map(element => {
        this.payment.push(this.fb.group({
          payment_type: element.payment_type,
          account_number: element.account_number,
          account_name: element.account_name,
          routing_number: element.routing_number,
          cvv: element.cvv,
          expiry_month: element.expiry_month,
          expiry_year: element.expiry_year,
          valid: element.valid,
        }));
      });
      this.payment.removeAt(0);

      const DocumentDetails = JSON.parse(localStorage.getItem('ClientDetails')).clientDocumentDetails;

      DocumentDetails.map(element => {
        this.document.push(this.fb.group({
          attachment_type: element.attachment_type,
          attachment_description: element.attachment_description,
          attachment_location: element.attachment_location,
        }));
      });
      this.document.removeAt(0);

    }
  }

  /**
   * get constants 
   */
  getConstants() {
    const Obj = {
      userId: localStorage.getItem('userId')
    }
    this.api.getConstants(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        localStorage.setItem('constants', JSON.stringify(data.result));
        this.contactype = data.result.contactType;
        this.clientType = data.result.clientType;
        this.addresstype = data.result.addressType;
        this.incomeFrequency = data.result.incomeFrequency;
        this.paymentType = data.result.paymentType;
      }
    });
    this.api.documentDropDownValues(Obj).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.docType = data.result;
        localStorage.setItem('docType', JSON.stringify(data.result));
      }
    });
  }

  /**
   * DOCUMENT
   */
  get document() {
    return this.documentForm.get('document') as FormArray;
  }

  addDocument() {
    this.document.push(this.fb.group({
      attachment_id: "",
      attachment_type: "",
      attachment_description: "",
      attachment_location: "",
    }));
  }

  deleteDocument(index) {
    this.document.removeAt(index);
  }

  saveDocument() {
    
    const individualValue = this.individualForm.value;
    if(individualValue.height_inches == '' || individualValue.height_feet == '' 
    || individualValue.weight=='' || individualValue.DOB==''){
          this.modalMessage = 'Fields are missing in Individual form!!';
          return this.modalService.open(this.modal);
    }

    //individuals
    this.individualForm.value.height_inches = this.individualForm.value.height_inches.toString();
    this.individualForm.value.height_feet = this.individualForm.value.height_feet.toString();
    this.individualForm.value.weight = this.individualForm.value.weight.toString();
    this.individualForm.value.DOB = new Date(this.individualForm.value.DOB).toISOString().split('T')[0];
    this.individualForm.value.userId = localStorage.getItem('userId');
    localStorage.setItem('individualDetails', JSON.stringify(this.individualForm.value));

    //contacts
    this.contacts.value.map(
      (element, i) => {
        this.modalService.dismissAll();
        if (element.phone === '' || element.email === '' || element.contact_type === '') {
          this.contactError = true;
          this.contactFormError = 'Fields are missing in contact form!!';
          this.modalMessage = 'Fields are missing in contact form!!';
          return this.modalService.open(this.modal);
        }
        var patt = new RegExp(/\S+@\S+\.\S+/);
        if (!patt.test(element.email)) {
          this.modalMessage = 'Please Enter Correct Email Format!!';
          return this.modalService.open(this.modal);
        } else {
          const id = i + 1;
          element.phone = element.phone.toString();
          element.contact_id = id.toString();
          this.contactError = false;
          //contacts
          var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
          getDetail.clientContactDetails = this.contacts.value;
          localStorage.setItem('individualDetails', JSON.stringify(getDetail));
        }
      }
    );

    //address
    this.address.value.map(
      (element, i) => {
        this.modalService.dismissAll();
        if (element.number === '' || element.street === '' || element.suite === '' || element.city === ''
          || element.state === '' || element.zip === '' || element.address_type === '' || element.from_date === '' || element.to_date === '') {
          this.addressError = true;
          this.addressFormError = 'Fields are missing in Address form!!';
          this.modalMessage = 'Fields are missing in Address form!!';
          return this.modalService.open(this.modal);
        } else {
          const id = i + 1;
          element.address_id = id.toString();
          element.zip = element.zip.toString();
          element.from_date = new Date(element.from_date).toISOString().split('T')[0];
          element.to_date = new Date(element.to_date).toISOString().split('T')[0];
          this.addressError = false;
          var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
          //address
          getDetail.clientAddressDetails = this.address.value;
          localStorage.setItem('individualDetails', JSON.stringify(getDetail));

        }
      }
    );

    //employer
    this.employer.value.map(
      (element, i) => {
        this.modalService.dismissAll();
        if (element.employer_name === '' || element.employer_phone === '' || element.income_amount === '' || element.income_frequency === ''
          || element.start_date === '' || element.end_date === '') {
          this.employerError = true;
          this.employerFormError = 'Please fill all fields!!';
          this.modalMessage = 'Fields are missing in Employment form!!';
          return this.modalService.open(this.modal);
        } else {
          const id = i + 1;
          element.employment_id = id.toString();
          element.income_amount = element.income_amount.toString();
          element.employer_phone = element.employer_phone.toString();
          element.start_date = new Date(element.start_date).toISOString().split('T')[0];
          element.end_date = new Date(element.end_date).toISOString().split('T')[0];
          this.employerError = false;
          var getDetail = JSON.parse(localStorage.getItem('individualDetails'));
          //employer
          getDetail.clientEmploymentDetails = this.employer.value;
          localStorage.setItem('individualDetails', JSON.stringify(getDetail));
        }
      }
    );

    //payment
    this.payment.value.map(
      (element, i) => {
        this.modalService.dismissAll();
        if (element.payment_type === '' || element.account_number === '' || element.account_name === '' || element.routing_number === ''
          || element.cvv === '' || element.expiry_month === '' || element.expiry_year === '' || element.valid === '') {
          this.paymentError = true;
          this.paymentFormError = 'Please fill all fields!!';
          this.modalMessage = 'Fields are missing in Payment form!!';
          return this.modalService.open(this.modal);
        } else {
          const id = i + 1;
          element.cvv = element.cvv.toString();
          element.expiry_year = element.expiry_year.toString();
          element.account_number = element.account_number.toString();
          element.valid = element.valid.toString();
          element.payment_method_id = id.toString();
          this.paymentError = false;
          var getDetail = JSON.parse(localStorage.getItem('individualDetails'));


          //payment
          getDetail.clientPaymentMethods = this.payment.value;
          localStorage.setItem('individualDetails', JSON.stringify(getDetail));
        }

      }
    );

    //document
    this.document.value.map(
      (element, i) => {
        this.modalService.dismissAll();
        if (element.attachment_type === '' || element.attachment_description === '' || element.attachment_location === '') {
          this.documentError = true;
          this.documentFormError = 'Please fill all fields!!';
          this.modalMessage = 'Fields are missing in Attachment form!!';
          return this.modalService.open(this.modal);
        } else {
          const id = i + 1;
          element.attachment_id = id.toString();
          this.documentError = false;

          var getDetail = JSON.parse(localStorage.getItem('individualDetails'));

          //documents
          getDetail.clientDocumentDetails = this.document.value;
          localStorage.setItem('individualDetails', JSON.stringify(getDetail));
        }

      }
    );

    if (!this.documentError) {

      //createClient
      const Obj = JSON.parse(localStorage.getItem('individualDetails'));
      this.api.createClient(Obj).subscribe((data: any) => {
        setTimeout(function () { this.spinner.show(); }, 3000);
        if (data.responseCode === 200) {
          this.spinner.hide();
          this.documentSuccess = true;
          this.documentMessage = data.message;
          this.modalMessage = data.message;
          this.modalService.open(this.modal);
          this.hideSubmit = true;
          this.successModal = true;
          this.confirmModal = false;
        } else {
          this.spinner.hide();
          this.documentError = true;
          return this.documentFormError = data.error;
        }
      });

    }
  }

  onFileSelect(event) {

    this.selectedFile = <File>event[0];
  }

  uploadFile(index) {
    this.modalService.dismissAll();

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('userId', localStorage.getItem('userId'));
    console.log(formData);

    this.api.uploadAttachment(formData).subscribe((data: any) => {
      setTimeout(function () { this.spinner.show(); }, 3000);
      if (data.responseCode === 200) {
        this.spinner.hide();
        const location = this.documentForm.controls.document['controls'][index].controls.attachment_location;
        location.value = data.result.fileName;
        this.modalMessage = data.message;
        return this.modalService.open(this.modal);
      } else {
        this.modalMessage = data.error;
        return this.modalService.open(this.modal);
      }
    });
    this.modalService.dismissAll();

  }


  /**
   * PAYMENT
   */
  get payment() {
    return this.paymentForm.get('payment') as FormArray;
  }

  addPayment() {
    this.payment.push(this.fb.group({
      payment_type: "",
      account_number: "",
      account_name: "",
      routing_number: "",
      cvv: "",
      expiry_month: "",
      expiry_year: "",
      valid: "",
    }));
  }

  deletePayment(index) {
    this.payment.removeAt(index);
  }


  disableField(index, value) {
    const Form = this.paymentForm.controls.payment['controls'][index].controls;
    if (Form.payment_type.value == '4' || Form.payment_type.value == '5') {
      Form.expiry_year.disable();
      Form.cvv.disable();
      Form.expiry_month.disable();
      Form.routing_number.enable();
    } else {
      Form.routing_number.disable();
      Form.expiry_year.enable();
      Form.cvv.enable();
      Form.expiry_month.enable();
    }
  }

  /**
   * EMPLOYER
   */
  get employer() {
    return this.employerForm.get('employer') as FormArray;
  }

  addEmployer() {
    this.employer.push(this.fb.group({
      employer_name: "",
      employer_phone: "",
      income_amount: "",
      income_frequency: "",
      start_date: "",
      end_date: ""
    }));
  }

  deleteEmployer(index) {
    this.employer.removeAt(index);
  }


  /**
   * ADDRESS
   */
  get address() {
    return this.addressForm.get('address') as FormArray;
  }

  addAddress() {
    this.address.push(this.fb.group({
      number: "",
      street: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
      address_type: "",
      from_date: "",
      to_date: ""
    }));
  }

  deleteAddress(index) {
    this.address.removeAt(index);
  }


  /**
   * CONTACTS
   */
  get contacts() {
    return this.contactForm.get('contacts') as FormArray;
  }

  addContacts() {
    this.contacts.push(this.fb.group({
      phone: '',
      email: '',
      contact_type: '',
    }));
  }

  deleteContacts(index) {
    this.contacts.removeAt(index);
  }

}
