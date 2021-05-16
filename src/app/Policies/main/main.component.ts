import { Component, OnChanges, ViewChild, Input, OnInit, TemplateRef, SimpleChanges, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../configuration/constants';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { IndividualDetailServiceService } from '../../individual-detail-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { param } from 'jquery';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnChanges, OnDestroy {

  @ViewChild('mediumModalContent', { static: true }) modal: TemplateRef<any>;

  successMessage: string;
  success: boolean = false;
  mainForm: FormGroup;
  status: any;
  premium: any;
  payment_mode: any;
  policy_number: any;
  election: any;
  effective_date: any;
  application_date: any;
  paying_member: any;
  modalMessage: string;
  end_date: any;
  pay_frequency: any;
  modalRef: BsModalRef;
  notes: any;
  constants: any;
  clientType: any;
  // disable: boolean = false;
  userEdit: Boolean = false;
  deleteClient: boolean = false;
  errorModal: boolean = false;
  invalid: boolean = false;
  policytype: any;
  @ViewChild('template', { static: true }) templateRef: TemplateRef<any>;


  constructor(private activatedRoute: ActivatedRoute, private modalService: BsModalService, private savePolicies: IndividualDetailServiceService, private fb: FormBuilder, private api: ApiService, public Router: Router, public States: Constants) {
  }
  @Input() disable;
  @Input() type;

  ngOnChanges(disable: SimpleChanges): void {

    if (disable['disable'] && disable['disable'].previousValue != disable['disable'].currentValue) {

      if (disable.disable.currentValue) {
        if (this.policytype == 'I' || this.policytype == "|") {
          this.mainForm = new FormGroup({
            "policy_number": new FormControl('', [Validators.required]),
            "status": new FormControl(''),
            "election": new FormControl(''),
            "premium": new FormControl(''),
            "application_date": new FormControl(''),
            "effective_date": new FormControl('', [Validators.required]),
            "pay_frequency": new FormControl(''),
            "payment_mode": new FormControl(''),
            "end_date": new FormControl('', [Validators.required]),
            "notes": new FormControl(''),
          });
        } else {
          this.mainForm = new FormGroup({
            "policy_number": new FormControl('', [Validators.required]),
            "status": new FormControl(''),
            "premium": new FormControl(''),
            "application_date": new FormControl(''),
            "effective_date": new FormControl('', [Validators.required]),
            "pay_frequency": new FormControl(''),
            "payment_mode": new FormControl(''),
            "end_date": new FormControl('', [Validators.required]),
            "notes": new FormControl(''),
          });
        }
        this.buildmainForm();

        this.mainForm.disable();
      } else {
        if (localStorage.getItem("PoliciesDetails")) {
        this.mainForm.enable();
        }
      }
    }
    if (disable['type'] && disable['type'].previousValue != disable['type'].currentValue) {

      this.policytype = disable.type.currentValue ? disable.type.currentValue : 'I';

      if (!localStorage.getItem("PoliciesDetails")) {
        if (this.policytype == 'I' || this.policytype == "|") {
          this.mainForm = new FormGroup({
            "policy_number": new FormControl('', [Validators.required]),
            "status": new FormControl('',[Validators.required]),
            "election": new FormControl(''),
            "premium": new FormControl(''),
            "application_date": new FormControl('',[Validators.required]),
            "effective_date": new FormControl('', [Validators.required]),
            "pay_frequency": new FormControl(''),
            "payment_mode": new FormControl(''),
            "end_date": new FormControl('', [Validators.required]),
            "notes": new FormControl(''),
          });
        } else {
          this.mainForm = new FormGroup({
            "policy_number": new FormControl('', [Validators.required]),
            "status": new FormControl('',[Validators.required]),
            "premium": new FormControl(''),
            "application_date": new FormControl('',[Validators.required]),
            "effective_date": new FormControl('', [Validators.required]),
            "pay_frequency": new FormControl(''),
            "payment_mode": new FormControl(''),
            "end_date": new FormControl('', [Validators.required]),
            "notes": new FormControl(''),
          });
        }

      }
    }

    this.getConstants();
  }

  ngOnDestroy() {
    localStorage.removeItem("PoliciesDetails");
  }

  buildmainForm(): void {


    let getPolicyDetail = localStorage.getItem('PoliciesDetails')?JSON.parse(localStorage.getItem('PoliciesDetails'))["policyDetails"]:false;

    if (getPolicyDetail) {
      const Policy = getPolicyDetail[0];
      this.policy_number = Policy.policy_number;
      this.status = Policy.status;
      this.election = Policy.election;
      this.premium = Policy.premium;
      this.pay_frequency = Policy.pay_frequency;
      this.payment_mode = Policy.payment_mode;
      this.application_date = new Date(Policy.application_date);
      this.effective_date = new Date(Policy.effective_date);
      this.end_date = new Date(Policy.end_date);
      this.notes = Policy.notes;
    }
    // console.log(this.savePolicies.addToPolicy(this.mainForm.value));
  }


  /**
   * get constants
   */
  getConstants() {
    this.constants = JSON.parse(localStorage.getItem("policy_constants"));
  }

  format = (input) => {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$2/$3/$1');
  };

  onSubmit() {
    console.log(this.mainForm);

    if (this.mainForm.valid) {
      this.mainForm.value.userId = localStorage.getItem('userId');
      this.mainForm.value.application_date = moment(this.mainForm.value.application_date).format('MM/DD/YYYY');
      this.mainForm.value.effective_date = moment(this.mainForm.value.effective_date).format('MM/DD/YYYY');
      this.mainForm.value.end_date = moment(this.mainForm.value.end_date).format('MM/DD/YYYY');
      console.log(this.savePolicies.addToPolicy(this.mainForm.value));
    }
  }
}