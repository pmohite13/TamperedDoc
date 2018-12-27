import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  formGroup: FormGroup;
  result: string;
  supportedFileFormats: string[] = ['application/pdf', 'application/msword', 'text/plain'];
  fileFormatSupported: boolean = false;
  fileFormat: string;
  isTamperred: boolean = false;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.buildFormGroup();
  }

  ngOnInit() {
  }

  isSupportedFileFormat(type: string): boolean {
    return this.supportedFileFormats.includes(type);
  }

  onFileOriginalChange(event) {
    
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.fileFormat = event.target.files[0].type;
      if (this.isSupportedFileFormat(this.fileFormat)) {
        this.fileFormatSupported = true;
        reader.onload = () => {
          this.formGroup.patchValue({
            fileOrginal: reader.result
          });

          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      } else {
        this.fileFormatSupported = false;
      }
    }
  }

  onFileToCheckChange(event) {
   
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.fileFormat = event.target.files[0].type;
      if (this.isSupportedFileFormat(this.fileFormat)) {
        this.fileFormatSupported = true;
        reader.onload = () => {
          this.formGroup.patchValue({
            fileToCheck: reader.result
          });

          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      } else {
        this.fileFormatSupported = false;
      }
    }
  }

  onSubmit() {
  
    let docOrginal = this.formGroup.value.fileOrginal;
    let docToCheck = this.formGroup.value.fileToCheck;
    let test = sha256('hello');
    if (sha256(docOrginal) === sha256(docToCheck)) {
      this.isTamperred = false;
      this.result = 'Not tampered!!';
    }
    else {
      this.isTamperred = true;
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
