import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmptyExpr } from '@angular/compiler';

interface Employee{
  id: string;
  imageUrl:string;
  firstName: string;
  lastName:string;
  email:String;
  contactNumber:number;
  age:number;
  dob:string
  salary:number;
  address:string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private initialEmployeeList : Employee[] = [];
  employeeList: Employee[] = [];
  searchTerm: string = ''
  loading: boolean = false;
  page: number=1;
  pageSize: number = 10;

  employeeForm: any;

  constructor(private httpClient:HttpClient, private modalService: NgbModal, private fb: FormBuilder){
  }

  ngOnInit(){
    this.loadList();
    this.buildEmployeeForm();
  }


  onSort(event: any){

  }

  

  loadList(){
    const URL_LIST = 'https://hub.dummyapis.com/employee?noofRecords=100&idStarts=1';
    this.httpClient.get(URL_LIST).subscribe(result => this.employeeList = this.initialEmployeeList = result as Employee[]);
  }

  addNewEmployee(){
    const { firstName, lastName, imageUrl, address, salary, dob, contactNumber, email } = this.employeeForm.value;
    const formattedDob = `${dob.day}/${dob.month}/${dob.year}`;
    const newEmployee: Employee = {
      id : Date.now().toString(),
      dob: formattedDob,
      age: new Date().getFullYear() - dob.year,
      firstName, lastName, imageUrl, address, salary, contactNumber, email 
    }
    this.employeeList.push(newEmployee);
    this.initialEmployeeList = this.employeeList;
    this.employeeForm.reset();
  }

  deleteEmployee(id: string){
    if(confirm('do you want delete this employee !')){
    const indexOfEmployee = this.employeeList.findIndex(employee => employee.id === id);
    this.employeeList.splice(indexOfEmployee, 1);
    this.initialEmployeeList = this.employeeList;
  }
  }

  openAddNewEmployeeModal(content: any) {
		const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    modalRef.closed.subscribe(() => this.addNewEmployee())
}

buildEmployeeForm(){
  this.employeeForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    address: [''],
    email: [''],
    contactNumber:  [''],
    imageUrl: [''],
    dob: [''],
    salary:  [''],
  });
}

  search(){
    this.employeeList = this.initialEmployeeList.filter(employee => this.matches(employee));
  }

  matches(employee: Employee): boolean{
    return Object.values(employee)
    .map(value => value.toString().toLowerCase())
    .find(value => value.includes(this.searchTerm.toLowerCase()));
  }
}
