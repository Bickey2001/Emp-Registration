import { Component, OnInit ,ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmployeeComponent } from './employee/employee.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Emp-Registration';
  displayedColumns: string[] = ['fullname', 'email', 'phone', 'department',
  'designation', 'salary','dateofbirth','gender','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private employee:MatDialog, private api:ApiService){
   
  }
  ngOnInit():void{
    // throw new Error("Method not implemented")
    this.getAllEmployees();
  }
  openEmployee(){
     this.employee.open(EmployeeComponent, {
    width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllEmployees();
      }
    })
  }
  getAllEmployees(){
    this.api.getEmployee()
    .subscribe({
      next:(res)=>{
        // console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        alert("Somthing went wrong ")
      }
    })
  }
  editEmployee(row:any){
    this.employee.open(EmployeeComponent,{
      width:'30%',
      data:row  
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllEmployees();
      }
    })
  }
  deleteEmployee(id:number){
    console.log(id);
    this.api.deleteEmployee(id)
    .subscribe({
      next:(res)=>{
        alert("Employee delete sucessfully");
        this.getAllEmployees();
      },
      error:()=>{
        alert("Something went wrong")
    }
    })
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
