import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder, Validators,FormControl} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA}from '@angular/material/dialog';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  employeeForm!: FormGroup;
  actionBtn: string ="Save"
  constructor(private formBuilder :FormBuilder, 
              private api:ApiService,
              @Inject(MAT_DIALOG_DATA) public editData:any,
              private dialogRef:MatDialogRef<EmployeeComponent>) {
    
   }
  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      fullname: ['',Validators.required],
      email:['',Validators.required],
      phone:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      salary:['',Validators.required],
      dateofbirth:['',Validators.required],
      gender:['',Validators.required]
    });
    // console.log(this.editData);
    if(this.editData){
      this.actionBtn ="Update";
      this.employeeForm.controls['fullname'].setValue(this.editData.fullname);
      this.employeeForm.controls['email'].setValue(this.editData.email);
      this.employeeForm.controls['phone'].setValue(this.editData.phone);
      this.employeeForm.controls['department'].setValue(this.editData.department);
      this.employeeForm.controls['designation'].setValue(this.editData.designation);
      this.employeeForm.controls['dateofbirth'].setValue(this.editData.dateofbirth);
      this.employeeForm.controls['gender'].setValue(this.editData.gender);
      this.employeeForm.controls['salary'].setValue(this.editData.salary);
    }
  }
  addEmployee(){
    console.log(this.employeeForm.value);
    if(!this.editData){
      if(this.employeeForm.invalid){
        this.api.postEmployee(this.employeeForm.value)
        .subscribe({
          next:(res)=>{
            alert("Employee details added sucessfully")
            this.employeeForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Something went wrong ! ")
          }
        })
      }
      else{
        // this.getErrorMessage()
        alert("Please fill all the blanks !")
      }
    }
    else{
      this.actionBtn;
      this.dialogRef._containerInstance
      // this.submitted=true
      // if(this.employeeForm.invalid){
      //   return;
      // }
      this.updateEmployee();
    }
  }
  updateEmployee(){
    this.api.putEmployee(this.employeeForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Employee form updated sucessfully");
        this.employeeForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Something went wrong !");
      }
    })
  }

}
