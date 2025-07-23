import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PartMatrixComponent } from './part-matrix/part-matrix.component';
import { PartsMatrixSearchComponent } from './parts-matrix-search/parts-matrix-search.component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'register',component:RegisterComponent},
    {path:'partmaxtrix',component:PartMatrixComponent},
    {path:'matrixsearch',component:PartsMatrixSearchComponent}
];
