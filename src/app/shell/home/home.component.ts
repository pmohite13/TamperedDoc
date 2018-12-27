import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { sha256 } from 'sha256';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  formGroup: FormGroup;
  result: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.buildFormGroup();
  }

  ngOnInit() {
  }

  onFileOriginalChange(event) {
    debugger;
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);


      reader.onload = () => {
        this.formGroup.patchValue({
          fileOrginal: reader.result
        });

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  onFileToCheckChange(event) {
    debugger;
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);


      reader.onload = () => {
        this.formGroup.patchValue({
          fileToCheck: reader.result
        });

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  onSubmit() {
    debugger;
    let docOrginal = this.formGroup.value.fileOrginal;
    let docToCheck = this.formGroup.value.fileToCheck;
    let test = sha256('hello');
    if (sha256(docOrginal) === sha256(docToCheck)) {
      this.result = 'Not tampered!!';
    }
    else {
      this.result = 'Tampered!!';
    }
  }

  buildFormGroup(): void {
    this.formGroup = this.fb.group({
      fileOrginal: ['', Validators.required],
      fileToCheck: ['', Validators.required]
    });
  }

}
