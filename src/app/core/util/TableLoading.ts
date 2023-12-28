
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject, Subject } from "rxjs";

export class TableLoading extends MatTableDataSource<any>{
   
    public loading = new BehaviorSubject<boolean>(false);
    
    
    

}